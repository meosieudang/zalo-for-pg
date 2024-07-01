import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReportContent } from "../types/api";
import { configAppView } from "zmp-sdk/apis";
import { Header } from "zmp-ui";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import ErrorScreen from "../components/error-screen";

const WelcomeGame = () => {
  let { code } = useParams();
  const navi = useNavigate();

  const onCloseApp = async () => {
    navi("/", { replace: true });
  };

  useEffect(() => {
    configAppView({
      headerColor: "#f2f2f2",
      actionBar: {
        title: "CREGift",
        leftButton: "none",
      },
      success: () => {
        // xử lý khi gọi api thành công
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  }, []);

  const onBackClick = () => {
    const a = confirm(`Bạn có muốn thoát?`);
    if (a) {
      navi("/", { replace: true });
    }
  };

  const onStart = () => navi(`/game/${code}`, { replace: true });

  return (
    <Box
      minHeight={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      flex={1}
      bgcolor={"white"}
    >
      <Header title={"CREGift"} onBackClick={onBackClick} />

      <Stack
        spacing={2}
        display={"flex"}
        flexGrow={1}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography variant="h6">{`Xin chào quý khách`}</Typography>
        <Button variant="contained" onClick={onStart}>{`Chơi ngay`}</Button>
      </Stack>
    </Box>
  );
};

export default WelcomeGame;
