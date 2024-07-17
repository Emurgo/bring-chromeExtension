
# chromeExtension - Bring


### This repository contain Two parts:

1. **iframe-frontend:** The frontend side which goes inside an iframe.
    1. To run this project, `cd` to `/chromeExtension/iframe-frontend` and run `yarn install`, after done installing run `yarn dev`.
    
1. **extension-files:** Divided to two parts:
    1. **bringweb3-sdk:** The part that goes inside other extensions to add our features.
    1. **test-extension:** An extension to test our SDK.
        1. To run this extension:
            1. `cd` to `/chromeExtension/extension-files/test-extension` and run `yarn install`.
            1. After done installing `cd` to `/chromeExtension/extension-files/bringweb3-sdk` and run `yarn link`.
            1. `cd` back to `/chromeExtension/extension-files/test-extension` and run `yarn link bringweb3-sdk`.
            1. Run `yarn watch` and add the build directory to your extensions on **Chrome**.