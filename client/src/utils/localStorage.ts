const ACCESS_TOKEN = "ACCESS_TOKEN";

interface Access {
  access_token: string;
}

export const setAccess = (value: Access) => {
  localStorage.setItem(ACCESS_TOKEN, value.access_token);
};

export const deleteAccess = () => {
  localStorage.clear();
};

export const getAccess = () => {
  return {
    access_token: localStorage.getItem(ACCESS_TOKEN),
  };
};
