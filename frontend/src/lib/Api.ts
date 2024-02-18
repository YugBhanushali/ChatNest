import { useAuthHook } from "@/store/AuthHook";

export const Apiurl = import.meta.env.VITE_API_URL;

export async function ApiCaller(
  path: string,
  method: string,
  args: any,
  headers?: any
) {
  const requestOptions: any = {
    method: String(method),
    headers: headers,
  };

  // Add body to request if method is POST
  if (method === "POST") {
    requestOptions.body = JSON.stringify(args);
  }

  if (!headers) {
    requestOptions.headers = {
      "Content-Type": "application/json",
    };
  }
  const res = await fetch(`${Apiurl}/${path}`, requestOptions);
  const data = await res.json();
  const status = res.status;

  return {
    data,
    status,
  };
}

export async function setUser(userId: string) {
  const { data, status } = await ApiCaller(`api/user/${userId}`, "GET", {});

  useAuthHook.setState({
    userId: userId,
    username: data.user.username,
    email: data.user.email,
    isSignedIn: true,
  });
  return status;
}
