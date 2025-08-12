# mixedbread-ai-provider

## 3.0.0

### Major Changes

- Remove deprecated/unsupported Mixedbread provider options.

  The only supported keys under `providerOptions.mixedbread` are now:
  - `prompt` (string, up to 256 chars)
  - `normalized` (boolean)
  - `dimensions` (number)
  - `encodingFormat` ("float" | "float16" | "binary" | "ubinary" | "int8" | "uint8" | "base64")

  Any other keys previously accepted by mistake have been removed. Update your integrations to use only the options listed above.

## 2.0.0

### Major Changes

- a6c94e8: Update to ai sdk beta
  - @ai-sdk/provider and @ai-sdk/provider-utils beta
  - change to zod v4 internally

## 2.0.0-beta.0

### Major Changes

- Update to ai sdk beta
  - @ai-sdk/provider and @ai-sdk/provider-utils beta
  - change to zod v4 internally

## 1.1.1

### Patch Changes

- change the base url to https://api.mixedbread.com/v1

## 1.1.0

### Minor Changes

- Update dependencies
  - @ai-sdk/provider 1.0.0 → 1.1.3
  - @ai-sdk/provider-utils 2.0.0 → 2.2.8

## 1.0.2

### Patch Changes

- fix adding additional settings to the model(see README for usage)

## 1.0.1

### Patch Changes

- fix max embeddings per call to `256`

## 1.0.0

### Update dependencies

- Update dependencies to latest versions

## 0.0.4

### Patch Changes

- Update example usage to README

## 0.0.3

### Patch Changes

- Added example usage to README
- Fix test types
- Fix response type

## 0.0.2

### Patch Changes

- Publish to npm

## 0.0.1

### Patch Changes

- First public release
