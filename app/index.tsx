// android :'261007022950-9r01hh9mqu6dgt53t3bcnlubll3kuvst.apps.googleusercontent.com'
// ios: '261007022950-anqasneusa4uep2p47uvbu9h79c9a3ce.apps.googleusercontent.com'
// web: '261007022950-6abo26bo3sfedg75u88cbpr5s7a29dt1.apps.googleusercontent.com'

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text } from 'tamagui';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "261007022950-9r01hh9mqu6dgt53t3bcnlubll3kuvst.apps.googleusercontent.com",
    iosClientId: "261007022950-anqasneusa4uep2p47uvbu9h79c9a3ce.apps.googleusercontent.com",
    webClientId: "261007022950-6abo26bo3sfedg75u88cbpr5s7a29dt1.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success") {
        // setToken(response.authentication.accessToken);
        getUserInfo(response?.authentication?.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
      <View>
      {!userInfo ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <View >
          <Text> User Exists</Text>
        </View>
      )}
      <Button
        title="remove local store"
        onPress={async () => await AsyncStorage.removeItem("@user")}
      />
    </View>
      </Container>
    </>
  );
}
