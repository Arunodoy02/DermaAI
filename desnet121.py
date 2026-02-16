import pandas as pd
import os
import tensorflow as tf
from sklearn.model_selection import train_test_split

# Paths
data_dir = "C:/Users/SoEE2/Desktop/Arunoday/MAJOR/IMAGES"
metadata_path = "C:/Users/SoEE2/Desktop/Arunoday/MAJOR//HAM10000_metadata.tab"

# Load and fix CSV (since it’s one long string per row)
df = pd.read_csv(metadata_path, sep='\t')
# df = df[0].str.split(",", expand=True)

# Assign proper column names
df.columns = ["lesion_id", "image_id", "dx", "dx_type", "age", "sex", "localization"]

# Map image paths
# Correcting the path mapping based on the updated data_dir
df['path'] = df['image_id'].apply(lambda x: os.path.join(data_dir, f"{x}.jpg"))

# Encode labels
class_names = df['dx'].unique()
class_to_idx = {c:i for i,c in enumerate(class_names)}
df['label'] = df['dx'].map(class_to_idx)

display(df.head())
# df.tail(5)
class_names
print(df['label'].value_counts())
total_samples1 = df.shape[0]
print("Total samples:", total_samples1)
duplicate_images_id = df[df.duplicated(subset=['lesion_id'], keep=False)]
duplicate_images_id.head()
# Remove duplicate lesion_id rows but keep the first occurrence (source)
df_cleaned = df.drop_duplicates(subset=['lesion_id'], keep='first')

# Optional: reset index after dropping duplicates
df_cleaned.reset_index(drop=True, inplace=True)

print(df_cleaned['label'].value_counts())
total_samples2 = df_cleaned.shape[0]
print("Total samples:", total_samples2)
print(total_samples1-total_samples2)
# Train-validation split
training_df, test_df = train_test_split(df_cleaned, test_size=0.2, stratify=df_cleaned['label'], random_state=42)

train_df, val_df = train_test_split(training_df, test_size=0.2, stratify=training_df['label'], random_state=42)

# TensorFlow dataset loader
IMG_SIZE = (224,224)

def preprocess(path, label):
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, IMG_SIZE)
    img = img / 255.0
    return img, label

train_ds = tf.data.Dataset.from_tensor_slices((train_df['path'], train_df['label']))
val_ds   = tf.data.Dataset.from_tensor_slices((val_df['path'], val_df['label']))
test_ds = tf.data.Dataset.from_tensor_slices((test_df['path'], test_df['label']))

train_ds = train_ds.map(preprocess).shuffle(1000).batch(64).prefetch(tf.data.AUTOTUNE)
val_ds   = val_ds.map(preprocess).batch(64).prefetch(tf.data.AUTOTUNE)
test_ds   = test_ds.map(preprocess).batch(64).prefetch(tf.data.AUTOTUNE)

print("Classes:", class_to_idx)
total_samples3 = training_df.shape[0]
print("Total samples:", total_samples3)
total_samples4 = test_df.shape[0]
print("Total samples:", total_samples4)
total_samples5 = val_df.shape[0]
print("Total samples:", total_samples5)
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal_and_vertical"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
#     tf.keras.layers.RandomContrast(0.1),
])
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal_and_vertical"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
#     tf.keras.layers.RandomContrast(0.1),
])

train_ds = train_ds.map(lambda x,y: (data_augmentation(x), y))
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_df['label']),
    y=train_df['label']
)
class_weights = dict(enumerate(class_weights))
print(class_weights)
from tensorflow.keras.applications import DenseNet121 # Import DenseNet121
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, Input
from tensorflow.keras.models import Model
import tensorflow as tf

# Load the DenseNet121 model with pre-trained weights (ImageNet)
# Exclude the top classification layer
base_model = DenseNet121(weights="imagenet", include_top=False, input_shape=(224, 224, 3)) # Changed to DenseNet121

# Freeze the base model layers initially
base_model.trainable = False

# Create an input layer
inputs = Input(shape=(224, 224, 3))

# Add the DenseNet121 preprocessing layer (DenseNet121 uses a different preprocessing)
x = tf.keras.applications.densenet.preprocess_input(inputs) # Changed preprocessing to DenseNet

# Connect the preprocessed input to the base model
x = base_model(x)

# Connect the base model output to the rest of the model
x = GlobalAveragePooling2D()(x)
# x = Dropout(0.3)(x)
# x = Dense(128, activation="relu")(x)
# x = Dropout(0.3)(x)
predictions = Dense(len(class_to_idx), activation="softmax")(x)

model = Model(inputs=inputs, outputs=predictions)
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau
import tensorflow as tf

# Focal Loss function
def sparse_focal_loss(gamma=2.0, alpha=0.25):
    def loss(y_true, y_pred):
        epsilon = 1e-7
        y_pred = tf.clip_by_value(y_pred, epsilon, 1. - epsilon)

        # Ensure y_true has a known rank and shape
        y_true = tf.cast(y_true, tf.int32)
        y_true = tf.squeeze(y_true)
        y_true = tf.ensure_shape(y_true, [None]) # Explicitly set shape to have unknown batch size and known rank

        # Convert integer labels to one-hot encoding
        y_true_one_hot = tf.one_hot(y_true, depth=tf.shape(y_pred)[-1])

        cross_entropy = -y_true_one_hot * tf.math.log(y_pred)
        weight = alpha * tf.math.pow(1 - y_pred, gamma)

        loss = weight * cross_entropy
        return tf.reduce_sum(loss, axis=1)

    return loss

# Callback to save the best model in SavedModel format
checkpoint = ModelCheckpoint(
    filepath='C:/Users/SoEE2/Desktop/Arunoday/MAJOR/IMAGES/best_model2.keras',           # Directory for SavedModel format
    monitor='val_loss',
    save_best_only=True,
    save_weights_only=False,         # Save full model (not just weights)
    mode='min',
    verbose=1
)

# Callback to reduce learning rate on plateau
reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=3,
    min_lr=1e-6,
    verbose=1
)


# Compile the model for the initial training phase (frozen layers)
opt = Adam(learning_rate=0.001)
model.compile(opt, loss=sparse_focal_loss(gamma=2.0, alpha=0.25), metrics=["accuracy"])

print("Initial training with frozen layers...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=20, # Train for a few epochs with frozen layers
    class_weight=class_weights,
    callbacks=[checkpoint, reduce_lr]
)

# Unfreeze the base model for fine-tuning
# model.trainable = True

# Freeze all layers first
for layer in base_model.layers:
    layer.trainable = False

# Unfreeze from Block 2 onward
set_trainable = False
for layer in base_model.layers:
    if "conv_" in layer.name:  # first layer of Block 2
        set_trainable = True
        print(layer.name)
    if set_trainable:
        layer.trainable = True

# Recompile the model with a lower learning rate for fine-tuning
opt_fine_tune = Adam(learning_rate=0.0001) # Use a smaller learning rate for fine-tuning
model.compile(opt_fine_tune, loss=sparse_focal_loss(gamma=2.0, alpha=0.25), metrics=["accuracy"])

print("\nFine-tuning the entire model...")
history_fine_tune = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=200, # Continue training for more epochs
    initial_epoch=history.epoch[-1] + 1, # Start from the last epoch of initial training
    class_weight=class_weights,
    callbacks=[checkpoint, reduce_lr], # Add reduce_lr for fine-tuning
)

# Combine histories for plotting
history.history['accuracy'].extend(history_fine_tune.history['accuracy'])
history.history['val_accuracy'].extend(history_fine_tune.history['val_accuracy'])
history.history['loss'].extend(history_fine_tune.history['loss'])
history.history['val_loss'].extend(history_fine_tune.history['val_loss'])
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

# Predictions
y_true = list(test_df['label'])
y_pred = np.argmax(model.predict(test_ds), axis=1)

print(classification_report(y_true, y_pred, target_names=class_names))
# !pip install seaborn
import matplotlib.pyplot as plt
# import seaborn as sns

# # Apply seaborn style
# sns.set_theme(style="whitegrid", palette="muted", font_scale=1.2)

# Plot accuracy
plt.figure(figsize=(10,5))
plt.plot(history_fine_tune.history['accuracy'], label='Train Accuracy', linewidth=2)
plt.plot(history_fine_tune.history['val_accuracy'], label='Val Accuracy', linewidth=2)
plt.title("Training vs Validation Accuracy", fontsize=16)
plt.xlabel("Epochs")
plt.ylabel("Accuracy")
plt.legend()
plt.show()

# Plot loss
plt.figure(figsize=(10,5))
plt.plot(history_fine_tune.history['loss'], label='Train Loss', linewidth=2)
plt.plot(history_fine_tune.history['val_loss'], label='Val Loss', linewidth=2)
plt.title("Training vs Validation Loss", fontsize=16)
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.legend()
plt.show()