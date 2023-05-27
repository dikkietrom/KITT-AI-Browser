# GPT Language Model API Documentation

## Overview

This API provides access to a GPT language model, allowing users to generate text and perform other natural language processing tasks. The GPT model is based on OpenAI's GPT-2 and Hugging Face's Transformers implementations. The API is implemented in PyTorch and is designed to be efficient and easy to use.

## Main Classes

### GPTConfig

The `GPTConfig` class holds the configuration for the GPT model, such as the number of layers, heads, and other hyperparameters. The default values are based on the GPT-2 architecture, but users can customize them as needed.

#### Attributes

- `block_size: int` (default=1024): The maximum sequence length that the model can process.
- `vocab_size: int` (default=50304): The size of the vocabulary, including special tokens.
- `n_layer: int` (default=12): The number of transformer layers in the model.
- `n_head: int` (default=12): The number of attention heads in each transformer layer.
- `n_embd: int` (default=768): The size of the token embeddings and transformer layers.
- `dropout: float` (default=0.0): The dropout rate applied to the model during training.
- `bias: bool` (default=True): Whether to include bias terms in linear layers and layer normalization.

### GPT
  n 
The `GPT` class is the main model class and inherits from `torch.nn.Module`. It implements the forward pass of the GPT model and provides methods for loading pre-trained weights and adjusting the model size.

#### Methods

- `__init__(self, config: GPTConfig)`: Initializes a GPT model with the given configuration.
- `forward(self, idx, targets=None)`: Performs a forward pass through the model with the input tokens `idx` and optionally computes the loss using the provided `targets`.
- `crop_block_size(self, block_size: int)`: Reduces the block size of the model to the given value, allowing for faster processing of shorter sequences.
- `from_pretrained(cls, model_type: str, override_args: dict=None)`: Loads pre-trained weights from a specified GPT-2 model type (e.g., 'gpt2', 'gpt2-medium', 'gpt2-large', or 'gpt2-xl').

### CausalSelfAttention, LayerNorm, MLP, and Block

These classes are used internally by the `GPT` model and implement various components of the transformer architecture, such as causal self-attention, layer normalization, feed-forward networks, and the overall structure of each transformer block.

## Usage

To use the GPT model, first create a `GPTConfig` object with the desired configuration. Then, instantiate a `GPT` model using that configuration. You can either train the model from scratch or load pre-trained weights from a GPT-2 model. Finally, call the `forward` method to generate text or compute the loss for training.

Example:

```python
from gpt_language_model import GPT, GPTConfig

config = GPTConfig(n_layer=12, n_head=12, n_embd=768)
model = GPT(config)

# Load pre-trained weights from a GPT-2 model
model = GPT.from_pretrained("gpt2")

# Generate text or compute loss using the forward method
logits, loss = model.forward(input_tokens, targets=target_tokens)
```

Please note that this example assumes you have already imported the `gpt_language_model` module and prepared the `input_tokens` and `target_tokens`.

## Tokenizer

To use the GPT model effectively, you need to tokenize the input text into a format the model can understand. We provide a `Tokenizer` class that performs tokenization, encoding, and decoding operations.

### Tokenizer

The `Tokenizer` class is responsible for converting text input into tokenized input, as well as decoding generated tokens back into text.

#### Methods

- `__init__(self, vocab_file: str)`: Initializes the tokenizer with a vocabulary file.
- `encode(self, text: str)`: Encodes a given input text into a list of token indices.
- `decode(self, tokens: List[int])`: Decodes a list of token indices back into text.

## Example Usage with Tokenizer

To integrate the `Tokenizer` class into the previous example, follow these steps:

1. Instantiate a `Tokenizer` object with a vocabulary file.
2. Encode the input text and target text (if applicable) using the `encode` method.
3. Pass the encoded input to the GPT model's `forward` method.
4. Decode the generated tokens (if applicable) using the `decode` method.

```python
from gpt_language_model import GPT, GPTConfig, Tokenizer

# Initialize the tokenizer
tokenizer = Tokenizer("path/to/vocab/file")

# Encode input and target text
input_text = "Once upon a time, there was a"
input_tokens = tokenizer.encode(input_text)
target_text = "princess in a faraway land."
target_tokens = tokenizer.encode(target_text)

# Initialize the GPT model
config = GPTConfig(n_layer=12, n_head=12, n_embd=768)
model = GPT(config)

# Load pre-trained weights from a GPT-2 model
model = GPT.from_pretrained("gpt2")

# Generate text or compute loss using the forward method
logits, loss = model.forward(input_tokens, targets=target_tokens)

# Decode the generated tokens
output_text = tokenizer.decode(logits.argmax(-1).tolist())
```

Please note that this example assumes you have already imported the `gpt_language_model` module and prepared the `input_tokens` and `target_tokens`.

## Training

To train the GPT model, you will need a dataset of text data and a PyTorch-compatible training loop. You can use the provided `GPT` and `Tokenizer` classes to tokenize and encode the text data, then feed the encoded tokens into the model's `forward` method to compute the loss.

After each forward pass, use an optimizer to update the model's weights based on the computed loss. Repeat this process for multiple epochs to fine-tune the GPT model on your dataset.

```python
import torch
from torch.utils.data import DataLoader
from gpt_language_model import GPT, GPTConfig, Tokenizer

# Initialize tokenizer, model, and optimizer
tokenizer = Tokenizer("path/to/vocab/file")
config = GPTConfig(n_layer=12, n_head=12, n_embd=768)
model = GPT(config)
optimizer = torch.optim.Adam(model.parameters(), lr=3e-5)

# Prepare dataset and dataloader
dataset = ...  # Your text dataset
dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

# Training loop
num_epochs = 10
for epoch in range(num_epochs):
for batch in dataloader:
# Tokenize and encode input and target text
input_tokens = tokenizer.encode_batch(batch["input_text"])
target_tokens = tokenizer.encode_batch(batch["target_text"])

# Forward pass and compute loss
logits, loss = model.forward(input_tokens, targets=target_tokens)

# Backward pass and optimizer

step
optimizer.zero_grad()
loss.backward()
optimizer.step()

# Save model checkpoint after each epoch
torch.save(model.state_dict(), f"model_checkpoint_epoch_{epoch}.pt")

# Print progress
print(f"Epoch {epoch + 1}/{num_epochs} - Loss: {loss.item()}")

# Load a saved model checkpoint
model.load_state_dict(torch.load("model_checkpoint_epoch_9.pt"))

# Evaluate and generate text
input_text = "Once upon a time, there was a"
input_tokens = tokenizer.encode(input_text)
logits, _ = model.forward(input_tokens)
output_text = tokenizer.decode(logits.argmax(-1).tolist())
print(output_text)
```

This example demonstrates how to train the GPT model on a custom dataset using PyTorch. Please note that you will need to provide your own text dataset and implement a suitable DataLoader for your specific use case.

## Conclusion

In this API documentation, we have covered the essential components and usage of the GPT language model. This includes the model architecture, tokenization, training, and text generation. With this information, you should be able to adapt the GPT model for your own text generation or NLP tasks.

## Advanced Usage

In this section, we will explore more advanced concepts and techniques related to the GPT language model.

### Fine-tuning for Specific Tasks

Fine-tuning the GPT model for a specific task allows you to take advantage of the knowledge and features the model has already learned and apply them to your custom task. Examples of tasks include text classification, sentiment analysis, and question-answering systems.

To fine-tune the GPT model for a specific task, you will need to modify the architecture by adding a task-specific head to the model. This head is usually a linear layer followed by an activation function, such as a softmax layer for classification tasks.

Here is an example of how to modify the GPT model for a classification task:

```python
import torch.nn as nn

class GPTClassifier(nn.Module):
    def __init__(self, gpt_model, num_classes):
        super().__init__()
        self.gpt_model = gpt_model
        self.classifier_head = nn.Linear(gpt_model.config.hidden_size, num_classes)
        
    def forward(self, input_ids, attention_mask=None):
        gpt_output = self.gpt_model(input_ids=input_ids, attention_mask=attention_mask)
        logits = self.classifier_head(gpt_output.pooler_output)
        return logits
```

### Controlling Text Generation

When using GPT for text generation, you may want to control the output based on specific requirements, such as style, tone, or content. There are several techniques available to achieve this:

1. **Temperature**: By controlling the temperature during text generation, you can influence the randomness of the output. Higher temperature values (e.g., 1.0) result in more random outputs, while lower values (e.g., 0.1) make the output more deterministic and focused on high-probability tokens.

2. **Top-K sampling**: During text generation, you can choose the K most probable tokens at each step and sample from them. This reduces the risk of generating low-quality text, while still maintaining some level of randomness.

3. **Top-p (nucleus) sampling**: Similar to Top-K sampling, Top-p sampling involves choosing a subset of tokens whose cumulative probability exceeds a certain threshold (e.g., 0.9). This dynamic approach allows for more diversity in the generated text.

4. **Length control**: You can control the length of the generated text by setting the `max_length` parameter during the text generation process.

### Monitoring Training Progress

During the training of the GPT model, it is essential to monitor the progress to ensure that the model is learning and improving over time. Common metrics used for monitoring progress include training loss, validation loss, and task-specific metrics such as accuracy, F1-score, or BLEU score.

To visualize these metrics, you can use libraries such as TensorBoard, WandB, or MLflow. These libraries enable you to track and compare different training runs, allowing you to identify the best model configurations and hyperparameters for your task.

### Additional Resources

To learn more about GPT and its applications, you can refer to the following resources:

1. Original GPT research paper: [Improving Language Understanding by Generative Pre-Training](https://s3-us-west-2.amazonaws.com/openai-assets/research-covers/language-unsupervised/language_understanding_paper.pdf)
2. GPT-2 research paper: [Language Models are Unsupervised Multitask Learners](https://d4mucfpksywv.cloudfront.net/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
3. GPT-3 research paper: [Language Models are Few-Shot Learners](https://arxiv.org