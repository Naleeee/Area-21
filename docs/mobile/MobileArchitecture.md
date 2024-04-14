# Mobile Architecture

## Structure

```
`-- mobile
   |-- assets
   |-- components
   |-- screens
   `-- utils
```

## Description

**Components**: Every useful components used in the app are created in the `components` folder.
They all have a `.ts` or `.tsx` file dedicated.

**Screens**: Every screens that composed the app are grouped in the `screens` folder.
A screen is composed by a single `.tsx` file.

**Assets**: All the used images, fonts and songs are stocked in the `assets` folder.

**Utils**: Every utility or helper methods that can be shared across the entire project must be created in the `utils` folder, like themes and languages.
