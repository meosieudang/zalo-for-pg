import React, { FC, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { configAppView } from "zmp-sdk/apis";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Header } from "zmp-ui";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useToBeImplemented } from "../hooks/useToBeImplemented";
import { red } from "@mui/material/colors";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StarIcon from "@mui/icons-material/Star";

const UserPage = () => {
  const { user, checkAuthorize } = useAuth();
  console.log(user, "user");

  useEffect(() => {
    setTimeout(() => {
      !user && checkAuthorize();
    }, 500);
  }, []);
  const onClick = useToBeImplemented();

  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(to bottom, #d32f2f, #d32f2f, #d32f2f, #d32f2f, #d32f2f, #de3f4d, #e65169, #eb6484, #ed8fb9, #ebb7df, #edddf5, #ffffff)",
      }}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      flex={1}
    >
      <Header
        showBackIcon={false}
        title="Thông tin tài khoản"
        backgroundColor="transparent"
        textColor="white"
      />
      {Boolean(user) ? (
        <List
          sx={{ bgcolor: "background.paper", m: 2, borderRadius: 2 }}
          disablePadding
        >
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar
                src={Boolean(user?.avatar) ? user?.avatar : "/broken-image.jpg"}
              />
            </ListItemAvatar>
            <ListItemText
              primary={user?.name ?? "Guest"}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  ></Typography>
                  {`${user?.id ?? "N/A"}`}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      ) : (
        <Subscription onClick={checkAuthorize} />
      )}

      <List sx={{ bgcolor: "background.paper", mx: 2, borderRadius: 2 }}>
        <ListItem disablePadding>
          <ListItemButton sx={{ minHeight: 60 }} onClick={onClick}>
            <SettingsIcon color="action" />
            <ListItemText sx={{ mx: 1 }} primary="Chỉnh sửa thông tin" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ minHeight: 60 }} onClick={onClick}>
            <StarIcon color="action" />
            <ListItemText sx={{ mx: 1 }} primary="Đánh giá" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default UserPage;

const Subscription = ({ onClick }: { onClick?: () => void }) => {
  return (
    <List sx={{ bgcolor: "background.paper", m: 2, borderRadius: 2 }}>
      <ListItem alignItems="center" onClick={onClick}>
        <ListItemAvatar>
          <Avatar src={"/broken-image.jpg"} />
        </ListItemAvatar>
        <ListItemText
          primary={"Đăng ký thành viên"}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              ></Typography>
              {`Tích điểm đổi thưởng, mở rộng tiện ích`}
            </React.Fragment>
          }
        />
        <KeyboardArrowRightIcon />
      </ListItem>
    </List>
  );
};
