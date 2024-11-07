import React, {FunctionComponent} from 'react';
import {observer} from 'mobx-react-lite';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {Text} from 'react-native';
import {useStyle} from '../../styles';
import {Box} from '../box';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Stack} from '../stack';
import {useStore} from '../../stores';
import {StackNavProp} from '../../navigation';
import {FormattedMessage} from 'react-intl';
// import {LinkIcon} from '../icon';
// import {Columns} from '../column';
import {COMMUNITY_CHAIN_URL} from '../../config';

export const DrawerContent: FunctionComponent = observer(() => {
  const {keyRingStore} = useStore();
  const navigation = useNavigation<StackNavProp>();

  const style = useStyle();

  const handleLock = async () => {
    await keyRingStore.lock();
    drawerClose();
    navigation.reset({
      routes: [
        {
          name: 'Unlock',
          params: {
            disableAutoBioAuth: true,
          },
        },
      ],
    });
  };

  const onClickManageChains = () => {
    drawerClose();

    if (keyRingStore.selectedKeyInfo) {
      navigation.navigate('Register.EnableChain', {
        vaultId: keyRingStore.selectedKeyInfo.id,
        skipWelcome: true,
        hideBackButton: false,
      });
    }
  };

  const onClickAddTokens = () => {
    drawerClose();
    navigation.navigate('Setting.ManageTokenList');
  };

  const onClickContacts = () => {
    drawerClose();
    navigation.navigate('Setting.General.ContactList');
  };

  const drawerClose = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <DrawerContentScrollView
      indicatorStyle="white"
      contentContainerStyle={[
        style.flatten([
          'height-full',
          'flex-column',
          'justify-between',
          'padding-x-20',
        ]),
      ]}
      style={{
        paddingTop: 58,
        paddingBottom: 58,
        paddingLeft: 20,
      }}>
      <Stack gutter={32}>
        <TouchableWithoutFeedback onPress={onClickManageChains}>
          <Text style={style.flatten(['h3', 'color-white'])}>
            <FormattedMessage id="page.main.components.menu-bar.manage-chain-visibility-title" />
          </Text>
        </TouchableWithoutFeedback>
        <Box
          width={40}
          height={1}
          backgroundColor={style.get('color-gray-400').color}
        />
        <Stack gutter={36}>
          <TouchableWithoutFeedback onPress={onClickContacts}>
            <Text style={style.flatten(['h3', 'color-white'])}>
              <FormattedMessage id="page.main.components.menu-bar.my-contacts-title" />
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={onClickAddTokens}>
            <Text style={style.flatten(['h3', 'color-white'])}>
              <FormattedMessage id="page.main.components.menu-bar.add-token-title" />
            </Text>
          </TouchableWithoutFeedback>
        </Stack>
      </Stack>
      <Stack gutter={32}>
        <TouchableWithoutFeedback onPress={handleLock}>
          <Text style={style.flatten(['h3', 'color-white'])}>
            <FormattedMessage id="page.main.components.menu-bar.lock-wallet-title" />
          </Text>
        </TouchableWithoutFeedback>
        <Box
          width={40}
          height={1}
          backgroundColor={style.get('color-gray-400').color}
        />
        <Stack gutter={36}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('Web', {
                url: COMMUNITY_CHAIN_URL,
                isExternal: true,
              });
            }}>
            {/* <Columns sum={1} gutter={4} alignY="center">
              <Text style={style.flatten(['h3', 'color-text-low'])}>
                <FormattedMessage id="page.main.components.menu-bar.go-to-deepwallet-chain-registry" />
              </Text>
              <LinkIcon size={20} color={style.get('color-text-low').color} />
            </Columns> */}
          </TouchableWithoutFeedback>
        </Stack>
      </Stack>
    </DrawerContentScrollView>
  );
});
