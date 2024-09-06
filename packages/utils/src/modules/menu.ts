import { Menu, MenuItem, MenuItemConstructorOptions } from "electron";

export interface IMenu {
  /**
   * Localize the provided menu by translating its labels
   * using the provided localization function.
   *
   * @param menu The menu to be localized.
   *
   * @param i18n The localization function.
   */
  localize: (menu: Menu, i18n: (label: string) => string) => Menu;
}

export const menu: IMenu = {
  localize: (menu: Menu, i18n: (label: string) => string) => {
    menu.items.forEach(item => localizeMenuItem(item, i18n));
    return Menu.buildFromTemplate(menuItemConstructorOptions(menu.items));
  }
};

const localizeMenuItem = (
  menuItem: Electron.MenuItemConstructorOptions | MenuItem,
  i18n: (label: string) => string
) => {
  menuItem.id = menuItem.id ? menuItem.id : menuItem.label;
  menuItem.label = menuItem.id ? i18n(menuItem.id) : menuItem.label;
  if (Array.isArray(menuItem.submenu)) {
    menuItem.submenu.forEach(item => localizeMenuItem(item, i18n));
  } else {
    menuItem.submenu?.items.forEach(item => localizeMenuItem(item, i18n));
  }
};

const menuItemConstructorOptions = (items: MenuItem[]): MenuItemConstructorOptions[] => {
  return items.map(
    item =>
      ({
        click: item.click,
        role: item.role,
        type: item.type,
        label: item.label,
        sublabel: item.sublabel,
        toolTip: item.toolTip,
        accelerator: item.accelerator,
        icon: item.icon,
        enabled: item.enabled,
        visible: item.visible,
        checked: item.checked,
        registerAccelerator: item.registerAccelerator,
        sharingItem: item.sharingItem,
        submenu: item.submenu ? menuItemConstructorOptions(item.submenu.items) : undefined,
        id: item.id
      }) as MenuItemConstructorOptions
  );
};
