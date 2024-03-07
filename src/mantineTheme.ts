import { createTheme, rem } from "@mantine/core";

const fontWeights = {
  thin: "100",
  extraLight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
  black: "900",
};

const fontSizesTitles = {
  fontSizeh1_128px: rem(128),
  fontSizeh2_88px: rem(88),
  fontSizeh3_48px: rem(48),
  fontSizeh4_40px: rem(40),
  fontSizeh5_36px: rem(36),
  fontSizeh6_32px: rem(32),
};
const mantineTheme = createTheme({
  colors: {
    background: [
      "#141620", // hsl(230, 23%, 10%)
      "#383943",
      "#4b4c55",
      "#5f6168",
      "#74757c",
      "#8a8b91",
      "#a0a1a6",
      "#b7b8bc",
      "#cfcfd2",
      "#e7e7e8",
    ],
    warm: [
      "#1d1c30",
      "#2b203e",
      "#3e234a",
      "#542353",
      "#6c2057",
      "#851957",
      "#9c0f52",
      "#b2044a",
      "#c4083d",
      "#d31d2b",
    ],
    cool: [
      "#1e222f",
      "#292e40",
      "#343b51",
      "#3f4862",
      "#4b5574",
      "#576487",
      "#62729a",
      "#6e81ae",
      "#7a90c2",
      "#86a0d7",
    ],
    gradients: ["#5A379F", "", "", "", "", "", "", "", "", ""],
    text: ["#F6EDFA", "#E4D6FF", "#FFFFFF", "", "", "", "", "", "", ""],
  },
  fontFamily: "Inter, sans serif",
  headings: {
    sizes: {
      h1: {
        fontSize: fontSizesTitles.fontSizeh1_128px,
        fontWeight: fontWeights.extraBold,
        lineHeight: "90%",
      },
      h2: {
        fontSize: fontSizesTitles.fontSizeh2_88px,
        fontWeight: fontWeights.bold,
        lineHeight: "90%",
      },
      h3: {
        fontSize: fontSizesTitles.fontSizeh3_48px,
        fontWeight: fontWeights.semiBold,
        lineHeight: "90%",
      },
      h4: {
        fontSize: fontSizesTitles.fontSizeh4_40px,
        fontWeight: fontWeights.medium,
        lineHeight: "90%",
      },
      h5: {
        fontSize: fontSizesTitles.fontSizeh5_36px,
        fontWeight: fontWeights.semiBold,
        lineHeight: "90%",
      },
      h6: {
        fontSize: fontSizesTitles.fontSizeh6_32px,
        fontWeight: fontWeights.medium,
        lineHeight: "90%",
      },
    },
  },
});

export default mantineTheme;
