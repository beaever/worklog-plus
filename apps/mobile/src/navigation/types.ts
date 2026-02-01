export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
};

export interface NavigationMessage {
  type: "NAVIGATION";
  payload: {
    route: keyof RootStackParamList;
    params?: Record<string, unknown>;
  };
}
