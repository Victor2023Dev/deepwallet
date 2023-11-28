import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {NotificationContext} from './context';
import {VerticalCollapseTransition} from '../../../components/transition/vertical-collapse';
import {Box} from '../../../components/box';
import {useStyle} from '../../../styles';
import {Gutter} from '../../../components/gutter';
import {Text, View} from 'react-native';

export const NotificationProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<
    {
      id: string;
      detached: boolean;

      mode: 'success' | 'failed' | 'plain';
      title: string;
      paragraph: string;
    }[]
  >([]);

  const clearDetached = (id: string) => {
    const find = notifications.find(notification => notification.id === id);
    if (find && find.detached) {
      setNotifications(prev => {
        return prev.filter(notification => notification.id !== id);
      });
    }
  };

  const hideFn = (id: string) => {
    setNotifications(prev => {
      const newNotifications = prev.slice();
      const find = newNotifications.find(
        notification => notification.id === id,
      );
      if (find) {
        find.detached = true;
      }
      return newNotifications;
    });
  };
  const hideFnRef = useRef(hideFn);
  hideFnRef.current = hideFn;

  const seqRef = useRef(0);
  const showFn: (
    mode: 'success' | 'failed' | 'plain',
    title: string,
    paragraph: string,
  ) => string = (mode, title, paragraph) => {
    seqRef.current = seqRef.current + 1;
    const id = seqRef.current.toString();

    setNotifications(prev => [
      ...prev,
      {
        id,
        detached: false,

        mode,
        title,
        paragraph,
      },
    ]);

    setTimeout(() => {
      hideFnRef.current(id);
    }, 2500);

    return id;
  };
  const showFnRef = useRef(showFn);
  showFnRef.current = showFn;

  return (
    <NotificationContext.Provider
      value={useMemo(() => {
        return {
          show: showFnRef.current,
          hide: hideFnRef.current,
        };
      }, [])}>
      {children}
      <React.Fragment>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
          pointerEvents="box-none">
          <React.Fragment>
            {notifications
              .slice()
              .reverse()
              .map(notification => {
                return (
                  <NotificationView
                    key={notification.id}
                    mode={notification.mode}
                    title={notification.title}
                    paragraph={notification.paragraph}
                    detached={notification.detached}
                    onTransitionEnd={() => {
                      clearDetached(notification.id);
                    }}
                  />
                );
              })}
          </React.Fragment>
        </View>
      </React.Fragment>
    </NotificationContext.Provider>
  );
};

const NotificationView: FunctionComponent<{
  detached: boolean;

  mode: 'success' | 'failed' | 'plain';
  title: string;
  paragraph: string;

  onTransitionEnd: () => void;
}> = ({detached, mode, title, paragraph, onTransitionEnd}) => {
  const [visible, setVisible] = useState(false);
  const style = useStyle();

  // XXX: VerticalCollapseTransition의 고질적인 문제로 인해서
  //      처음에 false로 시작한 후 그 직후 렌더링에서 바로 true로 했을 경우
  //      제대로 된 애니메이션이 실행되지 않는다.
  //      이 문제를 해결하기 위해서 VerticalCollapseTransition의 resize 핸들러가 작동한 후에
  //      visible을 true로 변경하도록 한다.
  const [resizeInit, setResizeInit] = useState(false);
  const [visibleOnAfterInit, setVisibleOnAfterInit] = useState(false);

  useEffect(() => {
    if (detached) {
      setVisible(false);
    } else {
      setVisibleOnAfterInit(true);
    }
  }, [detached]);

  useEffect(() => {
    if (resizeInit && visibleOnAfterInit) {
      setVisibleOnAfterInit(false);
      setVisible(true);
    }
  }, [resizeInit, visibleOnAfterInit]);

  const backgroundColor = (() => {
    switch (mode) {
      case 'success':
        return style.get('color-green-700').color;
      case 'failed':
        return '#705512';
      default:
        return style.get('color-gray-500').color;
    }
  })();
  const titleColor = (() => {
    switch (mode) {
      case 'success':
        return 'color-white';
      case 'failed':
        return 'color-white';
      default:
        return 'color-white';
    }
  })();
  const paragraphColor = (() => {
    switch (mode) {
      case 'success':
        return 'color-white';
      case 'failed':
        return 'color-white';
      default:
        return 'color-white';
    }
  })();

  return (
    <VerticalCollapseTransition
      collapsed={!visible}
      onTransitionEnd={onTransitionEnd}
      onResize={() => {
        setResizeInit(true);
      }}>
      <Box padding={12} paddingBottom={0}>
        <Box
          padding={18}
          backgroundColor={backgroundColor}
          borderRadius={8}
          style={{
            pointerEvents: 'auto',
          }}>
          <Text style={style.flatten(['subtitle4', titleColor as any])}>
            {title}
          </Text>
          {paragraph ? (
            <React.Fragment>
              <Gutter size={6} />
              <Text style={style.flatten(['body3', paragraphColor as any])}>
                {paragraph}
              </Text>
            </React.Fragment>
          ) : null}
        </Box>
      </Box>
    </VerticalCollapseTransition>
  );
};
