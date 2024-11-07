import styled, { css } from "styled-components";
import { Stack } from "../stack";
import { ColorPalette } from "../../styles";
import { GuideBoxColor, GuideBoxProps } from "./types";
import Color from "color";

export const getTitleColor = (
  color: GuideBoxColor | undefined
) => {
  switch (color) {
    case "safe":
      return ColorPalette["green-500"];
    case "warning":
      return ColorPalette["orange-400"];
    case "danger":
        return ColorPalette["red-400"];
    default:
      return ColorPalette["gray-500"];
  }
};

export const getParagraphColor = (
  color: GuideBoxColor | undefined
) => {
  switch (color) {
    case "safe":
      return Color(ColorPalette["green-500"]).alpha(0.7).string();
    case "warning":
      return Color(ColorPalette["orange-400"]).alpha(0.7).string();
    case "danger":
      return Color(ColorPalette["red-400"]).alpha(0.7).string();
    default:
      return ColorPalette["gray-300"];
  }
};

export const Styles = {
  Container: styled(Stack) <Pick<GuideBoxProps, "color" | "backgroundColor">>`
    border-radius: 0.5rem;
    padding: 1.125rem;

    ${({ color }) => {
      switch (color) {
        case "safe":
          return css`
            background-color: ${(props) =>
              props.theme.mode === "light"
                ? ColorPalette["green-50"]
                : ColorPalette["green-800"]};
          }
          svg {
            color: ${() => getTitleColor("safe")};
          }
          `;
        case "warning":
          return css`
            background-color: ${(props) =>
              props.theme.mode === "light"
                ? ColorPalette["orange-50"]
                : ColorPalette["yellow-800"]};
            }
            svg {
              color: ${() => getTitleColor("warning")};
            }
          `;
        case "danger":
          return css`
            background-color: ${(props) =>
              props.theme.mode === "light"
                ? ColorPalette["red-50"]
                : ColorPalette["red-800"]};
            svg {
              color: ${() => getTitleColor("danger")};
            }
          `;
        default:
          return css`
            background-color: ${(props) =>
              props.theme.mode === "light"
                ? ColorPalette["gray-50"]
                : ColorPalette["gray-600"]};
            svg {
              color: ${() => getTitleColor("default")};
            }
          `;
      }
    }};

    ${({ backgroundColor }) => {
      if (backgroundColor) {
        return css`
          background-color: ${backgroundColor};
        `;
      }
    }};
  `,
};
