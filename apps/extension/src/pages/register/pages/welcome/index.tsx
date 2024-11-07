import React, { FunctionComponent, useLayoutEffect } from "react";
import { Stack } from "../../../../components/stack";
import { Box } from "../../../../components/box";
import { ColorPalette } from "../../../../styles";
import { Column, Columns } from "../../../../components/column";
import { Subtitle2 } from "../../../../components/typography";
import { XAxis, YAxis } from "../../../../components/axis";
import { Gutter } from "../../../../components/gutter";
import { CheckIcon, LinkItem, PinView } from "./components";
import { Styles } from "./styled";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import { Button } from "../../../../components/button";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";

export const WelcomePage: FunctionComponent = observer(() => {
  const { chainStore } = useStore();
  const intl = useIntl();
  const theme = useTheme();
  const [isDesktop, setIsDesktop] = React.useState(true);

  const osmosisInfo = chainStore.chainInfos.find(
    (chainInfo) => chainInfo.chainId === "osmosis-1"
  );
  const stargazeInfo = chainStore.chainInfos.find(
    (chainInfo) => chainInfo.chainId === "stargaze-1"
  );

  useLayoutEffect(() => {
    if (window.innerWidth < 1150) {
      setIsDesktop(false);
    }

    const resizeHandler = () => {
      if (window.innerWidth < 1150) {
        setIsDesktop(false);
      } else {
        setIsDesktop(true);
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <Styles.Container>
      <PinView />

      <Stack alignX="left">
        {isDesktop ? null : (
          <React.Fragment>
            <CongratsImg size="150" />
            <Gutter size="1.25rem" />
          </React.Fragment>
        )}

        <Box
          padding="0.5rem 1rem"
          borderRadius="1.5rem"
          backgroundColor="#D5EAD8"
        >
          <Columns sum={1} gutter="0.625rem">
            <CheckIcon
              color={
                theme.mode === "light"
                  ? ColorPalette["green-500"]
                  : ColorPalette["green-400"]
              }
            />
            <Subtitle2
              color="#1A932E"
            >
              <FormattedMessage id="pages.register.pages.welcome.sub-title" />
            </Subtitle2>
          </Columns>
        </Box>

        <Gutter size="0.75rem" />

        <Styles.ResponsiveContainer>
          <Box width="37.5rem">
            <YAxis alignX="left">
              <Box
                width="31.25rem"
                style={{ fontWeight: 600, fontSize: "3.5rem" }}
              >
                <FormattedMessage id="pages.register.pages.welcome.title" />
              </Box>

              <Gutter size="2.25rem" />

              {/* <Box style={{ fontWeight: 500, fontSize: "1.25rem" }}>
                <FormattedMessage id="pages.register.pages.welcome.paragraph" />
              </Box> */}

              <Gutter size="1.5rem" />

              <Box width="100%">
                <Stack gutter="0.5rem">
                  <Columns sum={1} gutter="0.5rem">
                    <Column weight={1}>
                      <LinkItem
                        title={intl.formatMessage({
                          id: "pages.register.pages.welcome.osmosis-link.title",
                        })}
                        paragraph={intl.formatMessage({
                          id: "pages.register.pages.welcome.osmosis-link.paragraph",
                        })}
                        src={osmosisInfo?.chainSymbolImageUrl}
                        url="https://app.osmosis.zone/"
                      />
                    </Column>
                    <Column weight={1}>
                      <LinkItem
                        title={intl.formatMessage({
                          id: "pages.register.pages.welcome.kado-link.title",
                        })}
                        paragraph={intl.formatMessage({
                          id: "pages.register.pages.welcome.kado-link.paragraph",
                        })}
                        src={require("../../../../public/assets/img/fiat-on-ramp/kado.svg")}
                        url="https://www.kado.money/"
                      />
                    </Column>
                    <Column weight={1}>
                      <LinkItem
                        title={intl.formatMessage({
                          id: "pages.register.pages.welcome.stargaze-link.title",
                        })}
                        paragraph={intl.formatMessage({
                          id: "pages.register.pages.welcome.stargaze-link.paragraph",
                        })}
                        src={stargazeInfo?.chainSymbolImageUrl}
                        url="https://www.stargaze.zone/"
                      />
                    </Column>
                  </Columns>

                  {/* <Columns sum={1} gutter="0.5rem">
                    <Column weight={1}>
                      <LinkItem
                        title={intl.formatMessage({
                          id: "pages.register.pages.welcome.dashboard-link.title",
                        })}
                        paragraph={intl.formatMessage({
                          id: "pages.register.pages.welcome.dashboard-link.paragraph",
                        })}
                        src={require("../../../../public/assets/logo-256.png")}
                        url="https://wallet.keplr.app/"
                      />
                    </Column>
                    <Column weight={1}>
                      <LinkItem
                        title={intl.formatMessage({
                          id: "pages.register.pages.welcome.icns-link.title",
                        })}
                        paragraph={intl.formatMessage({
                          id: "pages.register.pages.welcome.icns-link.paragraph",
                        })}
                        src={require("../../../../public/assets/icns-logo.png")}
                        url="https://icns.xyz/"
                      />
                    </Column>
                  </Columns> */}
                </Stack>
              </Box>
            </YAxis>
          </Box>

          {isDesktop ? <CongratsImg size="450" /> : null}
        </Styles.ResponsiveContainer>

        <Gutter size="1.5rem" />

        <XAxis alignY="center">
          <Button
            text={intl.formatMessage({
              id: "pages.register.pages.welcome.finish-button",
            })}
            size="large"
            style={{ width: "10rem" }}
            onClick={() => {
              window.close();
            }}
          />
        </XAxis>
      </Stack>
    </Styles.Container>
  );
});

const CongratsImg: FunctionComponent<{ size: string }> = ({ size }) => {
  return (
    <img
      src={require("../../../../public/assets/img/intro.svg")}
      alt="DeepWallet logo"
      style={{
        width: `${size}px`,
        aspectRatio: "1 / 1",
      }}
    />
  );
};
