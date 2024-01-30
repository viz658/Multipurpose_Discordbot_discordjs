/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */

// JSX import is required if you want to use JSX syntax
// Builder is a base class to create your own builders
// loadImage is a helper function to load images from url or path
const { JSX, Builder, loadImage } = require("canvacord");
 class GreetingsCard extends Builder {
  constructor() {
    // set width and height
    super(930, 280);
    // initialize props
    this.bootstrap({
      displayName: "",
      type: "welcome",
      avatar: "",
      message: "",
      backgroundImage: "", // Add this line
    });
  }
  setDisplayName(value) {
    this.options.set("displayName", value);
    return this;
  }
  setType(value) {
    this.options.set("type", value);
    return this;
  }
  setAvatar(value) {
    this.options.set("avatar", value);
    return this;
  }
  setMessage(value) {
    this.options.set("message", value);
    return this;
  }
  setBackgroundImage(value) {
    this.options.set("backgroundImage", value);
    return this;
  }


  // this is where you have to define output ui
  async render() {
    const {
      type,
      displayName,
      avatar,
      message,
      backgroundImage, // Add this line
    } = this.options.getOptions();
    
    // make sure to use the loadImage helper function to load images, otherwise you may get errors
    const image = await loadImage(avatar);
    const bgImage = await loadImage(backgroundImage); // Add this line
    return JSX.createElement("div", {
      className: "h-full w-full flex flex-col items-center justify-center bg-[#23272A] rounded-xl",
      style: {
        backgroundImage: `url(${bgImage.toDataURL()})`, // Add this line
      },
    }, JSX.createElement("div", {
      className: "px-6 bg-[#2B2F35AA] w-[96%] h-[84%] rounded-lg flex items-center"
    }, JSX.createElement("img", {
      src: image.toDataURL(),
      className: "flex h-[40] w-[40] rounded-full"
    }), JSX.createElement("div", {
      className: "flex flex-col ml-6"
    }, JSX.createElement("h1", {
      className: "text-5xl text-white font-bold m-0"
    }, type === "welcome" ? "Welcome" : "Goodbye", ",", " ", JSX.createElement("span", {
      className: "text-blue-500"
    }, displayName, "!")), JSX.createElement("p", {
      className: "text-gray-300 text-3xl m-0"
    }, message))));
  }
}
module.exports = { GreetingsCard };