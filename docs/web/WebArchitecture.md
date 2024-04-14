# Web Architecture

## Structure

```
web
|-- public
    |-- fonts/
    |-- icons/
    `-- pictures/
|-- src
    |-- components
        |-- Component/
            |-- Component.module.scss
            `-- Component.tsx
        `-- index.ts
    |-- pages
        |-- api/
            |-- auth/
                `-- [...nextauth].js
        |-- page/
            `-- index.tsx
        |-- _app.tsx
        |-- _document.tsx
        `-- index.tsx
    |-- scripts
        `-- Utils.ts
    |-- styles
        |-- global.css
        `-- page.module.scss
`-- next.config.js
`-- package.json
```

## Description

- **public**
    - _Description_: contains the resources of the website
    - **fonts**
        - _Description_: fonts that will be used in css
    - **icons**
        - _Description_: icons of the services
    - **pictures**
        - _Description_: useful pictures for the project
- **components**
    - _Description_: folder where the components are located
    - **Component**
        - _Description_: folder that contains a component
        - `component.tsx`: content of the component
        - `component.module.scss`: style of the component
    - `index.tsx`: import and export all components
- **pages**
    - _Description_: folder where the pages are located
    - **api**
        - **auth**
            - `[...nextauth].js`: contains the providers of each service
    - **page**
        - `index.tsx`: page with the route: <u>localhost:8081/page</u>
    - `_app.tsx`: parent of all page
    - `_document.tsx`: html structure and global css call here
    - `index.tsx`: page with the route: <u>localhost:8081</u>
- **scripts**
    - _Description_: all the useful functions and scripts
    - `Utils.ts`: functions that make API calls
- **styles**
    - _Description_: globals and pages styles
    - `global.css`: global style for the tags and not the classes and the ids
    - `page.module.scss`: page style for the classes and the ids
- `next.config.json`: contains the environments variables and the client id with the client secret of each service<br/>
- `package.json`: information about the node application, modules and packages

## Rules

### • Component

A component is a part of code which is repeated at least 2 times in the same file or in different files.<br/>
This component should contain a content file and a style file as follows:
```
Component/
|-- Component.tsx
`-- Component.module.scss
```

### • Style

Each style file must be an '.scss'. The scss allows to make a more precise css.
Here is an example:
```scss
div#container {
    background-color: red;

    & > div.below {
        background-color: blue;
    }
}
```
In this example, we have a red background color on a 'div' with an id named 'container'.<br/>
We also have all the 'div' with the class 'below' which have a blue background color.

