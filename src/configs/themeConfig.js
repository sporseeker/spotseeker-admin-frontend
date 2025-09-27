// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: "SpotSeeker",
    appLogoImage: require("@src/assets/images/logo/logo.png").default,
    appLogoIcon: require("@src/assets/images/logo/Logo-icon.png").default
  },
  layout: {
    isRTL: false,
    skin: "semi-dark", // light, dark, bordered, semi-dark
    type: "vertical", // vertical, horizontal
    contentWidth: "full", // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "floating", // static , sticky , floating, hidden
      backgroundColor: "primary" // BS color options [primary, success, etc]
    },
    footer: {
      type: "static" // static, sticky, hidden
    },
    customizer: false,
    scrollTop: false, // Enable scroll to top button
    toastPosition: "top-right" // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  }
}

export default themeConfig
