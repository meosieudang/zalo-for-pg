// src/AuthContext.ts
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  clearStorage,
  getStorage,
  removeStorage,
  setStorage,
} from "zmp-sdk/apis";
import usePermissionZalo from "../hooks/usePermissionZalo";
import ModalRequestPermission from "../components/modal-request-permission";

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: (data) => {},
  logout: () => {},
  showModalPermission: () => {},
  checkAuthorize: () => {},
  phoneNumberZalo: "",
  hasAuthor: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [phoneNumberZalo, setPhoneNumberZalo] = useState("");
  const [accessTokenZalo, setAccessTokenZalo] = useState(null);
  const [hasAuthor, setHasAuthor] = useState(false);
  const refModal = useRef<{ toggle: () => void }>(null);
  const showModalPermission = () => refModal.current?.toggle();

  const {
    mFetchInfoNumber,
    mAuthorize,
    mAuthorizedState,
    mGetAccessToken,
    mGetPhoneNumber,
    mGetUserState,
  } = usePermissionZalo({
    mAuthorizedStateSuccess(authSetting) {
      if (
        !authSetting["scope.userInfo"] ||
        !authSetting["scope.userPhonenumber"]
      ) {
        refModal.current?.toggle();
      } else {
        setHasAuthor(true);
      }
    },
    mAuthorizeSuccess(d) {
      mGetAccessToken.mutate();
      mGetPhoneNumber.mutate();
      mGetUserState.mutate();
      refModal.current?.toggle();
    },
    mGetAccessTokenSuccess(d) {
      setAccessTokenZalo(d);
    },
    mGetPhoneNumberSuccess(code) {
      mFetchInfoNumber.mutate({
        code: code ?? "",
        access_token: accessTokenZalo ?? "",
      });
    },
    mGetUserStateSuccess(d) {
      setUser(d);
    },
    mFetchInfoNumberSuccess(d) {
      setPhoneNumberZalo(d);
    },
  });
  console.log(hasAuthor, "hasauthor");

  useEffect(() => {
    if (hasAuthor) {
      mGetPhoneNumber.mutate();
      mGetUserState.mutate();
    }
  }, [hasAuthor]);

  useEffect(() => {
    // refModal.current?.toggle();
    mGetAccessToken.mutate();
  }, []);

  const checkAuthorize = () => mAuthorizedState.mutate();

  const getLocalStorageItem = async () => {
    const res = await getStorage({ keys: ["username", "accessToken"] });
    console.log(res, "get");
    if (res) {
      // setUser({ username: res.username, token: res.accessToken });
    }
    return res;
  };

  useEffect(() => {
    // getLocalStorageItem();
    console.log("AuthProvider");
  }, []); // Empty dependency array to run only on initial render

  const login = async (data: { username: string; password: string }) => {
    // Simulate authentication (replace with your backend integration)
    const simulatedToken = "your_auth_token";
    // setUser({ username: data.username, token: simulatedToken });
    setStorage({
      data: {
        accessToken: simulatedToken,
        username: data.username,
      },
      success: (data) => {
        // xử lý khi gọi api thành công
        const { errorKeys } = data;
        console.log(errorKeys, "erk");
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  };

  const logout = () => {
    removeStorage({ keys: ["username", "accessToken"] });
    setUser(null);
  };

  const onAccept = () => mAuthorize.mutate();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        showModalPermission,
        phoneNumberZalo,
        checkAuthorize,
        hasAuthor,
      }}
    >
      {children}
      <ModalRequestPermission ref={refModal} onAccept={onAccept} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
