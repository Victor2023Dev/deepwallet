import React, { FunctionComponent } from "react";
import { RegisterSceneBox } from "../components/register-scene-box";
import { Stack } from "../../../components/stack";
import { Button } from "../../../components/button";
import {
  useSceneEvents,
  useSceneTransition,
} from "../../../components/transition";
import { useRegisterHeader } from "../components/header";
import { YAxis } from "../../../components/axis";
import { Gutter } from "../../../components/gutter";
// import { TextButton } from "../../../components/button-text";
import { observer } from "mobx-react-lite";
// import { useStore } from "../../../stores";
import { useIntl } from "react-intl";

export const RegisterIntroScene: FunctionComponent = observer(() => {
  // const { uiConfigStore } = useStore();
  const sceneTransition = useSceneTransition();
  const intl = useIntl();

  const header = useRegisterHeader();
  useSceneEvents({
    onWillVisible: () => {
      header.setHeader({
        mode: "intro",
      });
    },
  });

  return (
    <RegisterSceneBox>
      <YAxis alignX="center">
        <img
          src={require("../../../public/assets/img/intro.svg")}
          alt="DeepWallet logo"
          style={{
            width: "200px",
            aspectRatio: "1 / 1",
          }}
        />
      </YAxis>
      <Gutter size="3.125rem" />
      <Stack gutter="1.25rem">
        <Button
          text={intl.formatMessage({
            id: "pages.register.intro.create-wallet-button",
          })}
          size="large"
          onClick={() => {
            sceneTransition.push("new-user");
          }}
        />
        <Button
          text={intl.formatMessage({
            id: "pages.register.intro.import-wallet-button",
          })}
          size="large"
          color="secondary"
          onClick={() => {
            sceneTransition.push("existing-user");
          }}
          buttonStyle={{ background: 'white', border: '1px #807567 solid' }}
        />
        {/* {uiConfigStore.platform !== "firefox" ? (
          <TextButton
            text={intl.formatMessage({
              id: "pages.register.intro.connect-hardware-wallet-button",
            })}
            size="large"
            onClick={() => {
              sceneTransition.push("connect-hardware-wallet");
            }}
          />
        ) : null} */}
      </Stack>
    </RegisterSceneBox>
  );
});
