import React, { FunctionComponent, useMemo } from "react";
import { Column, Columns } from "../../../../components/column";
import { Button } from "../../../../components/button";
import { Box } from "../../../../components/box";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import { Dec } from "@keplr-wallet/unit";
import { Skeleton } from "../../../../components/skeleton";
import { useIntl } from "react-intl";

export const Buttons: FunctionComponent<{
  onClickDeposit: () => void;
  onClickBuy?: () => void;
  isNotReady?: boolean;
}> = observer(({ onClickDeposit, isNotReady }) => {
  const { hugeQueriesStore } = useStore();
  const navigate = useNavigate();
  const intl = useIntl();

  const balances = hugeQueriesStore.getAllBalances(true);
  const hasBalance = useMemo(() => {
    return balances.find((bal) => bal.token.toDec().gt(new Dec(0))) != null;
  }, [balances]);

  const onClickStaking = () => window.open("https://explorer.shentu.org/validators");

  return (
    <Box>
      <Columns sum={1} gutter="0.625rem">
        <Column weight={1}>
          <Skeleton type="button" isNotReady={isNotReady}>
            <Button
              textColor="#7E5700"
              buttonStyle={{ color: "#7E5700", background: "#FFEED9" }}
              text={intl.formatMessage({
                id: "page.main.components.buttons.deposit-button",
              })}
              color="secondary"
              onClick={onClickDeposit}
            />
          </Skeleton>
        </Column>

        <Column weight={1}>
          <Skeleton type="button" isNotReady={isNotReady}>
            <Button
              textColor="#7E5700"
              buttonStyle={{ color: "#7E5700", background: "#FFEED9" }}
              text={intl.formatMessage({
                id: "page.main.components.buttons.staking-button",
              })}
              color="secondary"
              onClick={onClickStaking}
            />
          </Skeleton>
        </Column>

        <Column weight={1}>
          <Skeleton type="button" isNotReady={isNotReady}>
            <Button
              textColor="#201B13"
              buttonStyle={{ color: "#201B13", background: "#FBBC49" }}
              text={intl.formatMessage({
                id: "page.main.components.buttons.send-button",
              })}
              disabled={!hasBalance}
              onClick={() => {
                navigate(
                  `/send/select-asset?navigateTo=${encodeURIComponent(
                    "/send?chainId={chainId}&coinMinimalDenom={coinMinimalDenom}"
                  )}`
                );
              }}
            />
          </Skeleton>
        </Column>
      </Columns>
    </Box>
  );
});
