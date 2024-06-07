import React, {FunctionComponent} from 'react';
import {IconProps} from './types';
import {Path, Svg} from 'react-native-svg';

export const SettingOutlinedIcon: FunctionComponent<IconProps> = ({
  size,
  color,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M23.1208 15.2589C22.9331 15.0491 22.8296 14.7793 22.8296 14.5C22.8296 14.2207 22.9331 13.9509 23.1208 13.7411L24.6191 12.0853C24.7842 11.9044 24.8867 11.6768 24.912 11.4351C24.9372 11.1934 24.8838 10.9501 24.7596 10.74L22.4185 6.76155C22.2954 6.55173 22.1081 6.38541 21.8832 6.28631C21.6583 6.1872 21.4073 6.16037 21.166 6.20963L18.9653 6.64657C18.6853 6.7034 18.3938 6.65759 18.1458 6.51779C17.8978 6.37798 17.7105 6.15384 17.6192 5.88767L16.9052 3.78346C16.8266 3.55507 16.677 3.35671 16.4775 3.2164C16.2779 3.0761 16.0385 3.00094 15.7931 3.00156H11.1109C10.8557 2.98848 10.6031 3.05782 10.3917 3.19901C10.1803 3.34019 10.0218 3.54546 9.94038 3.78346L9.28487 5.88767C9.19357 6.15384 9.00624 6.37798 8.75825 6.51779C8.51026 6.65759 8.21875 6.7034 7.93873 6.64657L5.67957 6.20963C5.45079 6.17787 5.21755 6.21333 5.00925 6.31155C4.80095 6.40977 4.6269 6.56634 4.50902 6.76155L2.16792 10.74C2.04051 10.9477 1.98323 11.1897 2.00425 11.4313C2.02528 11.6729 2.12353 11.9019 2.28497 12.0853L3.77157 13.7411C3.95923 13.9509 4.06273 14.2207 4.06273 14.5C4.06273 14.7793 3.95923 15.0491 3.77157 15.2589L2.28497 16.9147C2.12353 17.0981 2.02528 17.327 2.00425 17.5687C1.98323 17.8103 2.04051 18.0523 2.16792 18.26L4.50902 22.2384C4.63204 22.4483 4.81935 22.6146 5.04426 22.7137C5.26916 22.8128 5.52017 22.8396 5.76151 22.7904L7.96215 22.3534C8.24216 22.2966 8.53367 22.3424 8.78166 22.4822C9.02966 22.622 9.21698 22.8462 9.30828 23.1123L10.0223 25.2165C10.1038 25.4545 10.2623 25.6598 10.4736 25.801C10.685 25.9422 10.9376 26.0115 11.1929 25.9984H15.8751C16.1205 25.9991 16.3599 25.9239 16.5594 25.7836C16.759 25.6433 16.9086 25.4449 16.9871 25.2165L17.7011 23.1123C17.7924 22.8462 17.9798 22.622 18.2277 22.4822C18.4757 22.3424 18.7673 22.2966 19.0473 22.3534L21.2479 22.7904C21.4892 22.8396 21.7403 22.8128 21.9652 22.7137C22.1901 22.6146 22.3774 22.4483 22.5004 22.2384L24.8415 18.26C24.9658 18.0499 25.0191 17.8066 24.9939 17.5649C24.9687 17.3232 24.8661 17.0956 24.701 16.9147L23.1208 15.2589ZM21.3767 16.7997L22.3131 17.8345L20.8148 20.3872L19.4335 20.1112C18.5905 19.942 17.7135 20.0826 16.9691 20.5066C16.2246 20.9305 15.6645 21.6081 15.3951 22.4109L14.9503 23.6987H11.9537L11.5323 22.3879C11.2629 21.5852 10.7029 20.9075 9.95841 20.4836C9.21397 20.0596 8.33698 19.919 7.49393 20.0882L6.11267 20.3642L4.59096 17.823L5.5274 16.7882C6.10326 16.1557 6.42162 15.337 6.42162 14.4885C6.42162 13.64 6.10326 12.8213 5.5274 12.1888L4.59096 11.154L6.08926 8.6243L7.47051 8.90026C8.31357 9.06954 9.19056 8.92887 9.935 8.50494C10.6794 8.08102 11.2395 7.40335 11.5089 6.60057L11.9537 5.30125H14.9503L15.3951 6.61207C15.6645 7.41485 16.2246 8.09251 16.9691 8.51644C17.7135 8.94037 18.5905 9.08104 19.4335 8.91176L20.8148 8.6358L22.3131 11.1884L21.3767 12.2233C20.8073 12.8543 20.4929 13.6683 20.4929 14.5115C20.4929 15.3547 20.8073 16.1687 21.3767 16.7997ZM13.452 9.90063C12.526 9.90063 11.6207 10.1704 10.8507 10.6758C10.0808 11.1811 9.48062 11.8995 9.12624 12.7399C8.77185 13.5803 8.67913 14.5051 8.85979 15.3973C9.04046 16.2895 9.48639 17.109 10.1412 17.7522C10.796 18.3955 11.6303 18.8335 12.5386 19.011C13.4468 19.1885 14.3883 19.0974 15.2438 18.7493C16.0994 18.4012 16.8307 17.8116 17.3451 17.0553C17.8596 16.2989 18.1342 15.4097 18.1342 14.5C18.1342 13.2802 17.6409 12.1103 16.7628 11.2478C15.8848 10.3852 14.6938 9.90063 13.452 9.90063ZM13.452 16.7997C12.989 16.7997 12.5364 16.6648 12.1514 16.4121C11.7664 16.1594 11.4663 15.8003 11.2891 15.3801C11.1119 14.9598 11.0656 14.4974 11.1559 14.0514C11.2462 13.6053 11.4692 13.1955 11.7966 12.8739C12.124 12.5523 12.5412 12.3332 12.9953 12.2445C13.4494 12.1558 13.9202 12.2013 14.3479 12.3754C14.7757 12.5494 15.1413 12.8442 15.3986 13.2224C15.6558 13.6005 15.7931 14.0452 15.7931 14.5C15.7931 15.1099 15.5465 15.6948 15.1074 16.1261C14.6684 16.5574 14.0729 16.7997 13.452 16.7997Z"
        fill={color || 'currentColor'}
      />
    </Svg>
  );
};