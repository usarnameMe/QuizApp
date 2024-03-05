import React from "react";
import { Platform, KeyboardAvoidingViewProps } from "react-native";
import styled from "styled-components/native";

interface ScreenProps {
  children: React.ReactNode;
  background?: string;
}

interface MainWrapperProps extends KeyboardAvoidingViewProps {
  background?: string;
}

const MainWrapper = styled.KeyboardAvoidingView<MainWrapperProps>`
  flex: 1;
`;

const ImageBackground = styled.View<{ background?: string }>`
  flex: 1;
  background-color: ${(props) => props.background || "transparent"};
`;

const Container = styled.SafeAreaView<{ background?: string }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.background || "#ffffff"};
`;

export const Screen: React.FC<ScreenProps> = ({ children, background }) => {
  return (
    <MainWrapper behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ImageBackground background={background}>
        <Container background={background}>{children}</Container>
      </ImageBackground>
    </MainWrapper>
  );
};

export default Screen;
