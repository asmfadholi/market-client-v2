import Head from "next/head";
import * as qs from "qs";
import Button from "@mui/material/Button";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getImage } from "@/helpers/getImage";
import { useSnackbarActions } from "@/contexts/snackbarContext";
import mountainImg from "@/assets/images/mountain.jpeg";
import useAxios from "@/hooks/useAxios";

const styAvatar: SxProps<Theme> = {
  width: "150px",
  height: "150px",
};

const styButtonUpload: SxProps<Theme> = {
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "14px",
  marginTop: "12px",
  cursor: "pointer",
  lineHeight: "120%",
  display: "flex",
  alignItems: "center",
  letterSpacing: "0.005em",
  textDecorationLine: "underline",
  justifyContent: "center",
  color: "#3B82F6",
};

const allowFormatData = ["jpg", "jpeg", "png", "svg"];

const validateFormat = (fileData: File) => {
  const { type } = fileData;
  let isAllow = false;
  allowFormatData.forEach((data) => {
    if (type.includes(data)) {
      isAllow = true;
    }
  });

  return isAllow;
};

const readURL = (file: File) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res((e?.target?.result || "") as string);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });

const defaultErrorFormat =
  "Unsupported file format, only .jpg, .jpeg, .png or svg are supported";

const successUpdateShop = "Shop account updated successfully";

const SHOP_API = `${process.env.NEXT_PUBLIC_BASE_URL}/shops`;

interface ErrorStrapi {
  error: {
    message: string;
  };
}

function Home({ data }: { data: ShopDetail }) {
  const refInput = useRef<HTMLInputElement>(null);
  const getAxios = useAxios();
  const [loadingUpdatePhoto, setLoadingUpdatePhoto] = useState(false);
  const [loadingUpdateShop, setLoadingUpdateShop] = useState(false);
  const [hasChange, setHasChange] = useState(false);
  const { setShowSnackbar } = useSnackbarActions();
  const [file, setFile] = useState<File[]>([]);
  const [image, setImage] = useState("");

  const { attributes } = data;
  const { photo } = attributes;
  const { data: dataPhoto } = photo;
  const { attributes: attPhoto } = dataPhoto;

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoadingUpdatePhoto(true);
    const fileData = Array.from(e?.target?.files || []);
    if (!fileData.length) return;
    const isValid = validateFormat(fileData[0]);
    if (!isValid && refInput.current) {
      refInput.current.value = "";
      setShowSnackbar({
        show: true,
        type: "error",
        message: defaultErrorFormat,
      });
      return;
    }
    try {
      setFile(fileData);
      const url = await readURL(fileData[0]);

      setImage(url as string);
    } finally {
      setLoadingUpdatePhoto(false);
      setHasChange(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingUpdateShop(true);
    const dataForm = new FormData(event.currentTarget);

    const requestForm = new FormData();
    if (file?.[0]) {
      requestForm.append("files.photo", file?.[0]);
    }

    const bodyData = {
      name: dataForm.get("name") || "",
      address: dataForm.get("address") || "",
    };
    requestForm.append("data", JSON.stringify(bodyData));
    try {
      await getAxios().put(`${SHOP_API}/${data.id}`, requestForm);
      setShowSnackbar({
        show: true,
        message: successUpdateShop,
        type: "success",
      });
      setHasChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const getDataError = err.response?.data as ErrorStrapi;
        setShowSnackbar({
          show: true,
          message: getDataError?.error?.message,
          type: "error",
        });
      }
    } finally {
      setLoadingUpdateShop(false);
    }
  };

  return (
    <>
      <Head>
        <title>Account</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Card>
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image={mountainImg.src}
          />
          <CardContent sx={{ position: "relative", top: "-101px" }}>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="column"
              marginBottom="24px"
            >
              <Avatar
                alt={attPhoto.name}
                src={image || getImage(attPhoto.url)}
                sx={styAvatar}
              />
              <label htmlFor="contained-button-file">
                <Box sx={styButtonUpload}>Change Photo</Box>

                <Box fontSize={12} textAlign="center">
                  (.jpg, .jpeg, .png or .svg)
                </Box>

                <input
                  ref={refInput}
                  style={{ display: "none" }}
                  disabled={loadingUpdatePhoto}
                  onChange={handleChange}
                  accept="image/*"
                  data-testid="uploadImage"
                  id="contained-button-file"
                  multiple={false}
                  type="file"
                />
              </label>
            </Stack>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                onChange={() => setHasChange(true)}
                sx={{ mt: 1, maxWidth: "500px" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Shop Name"
                  name="name"
                  defaultValue={attributes.name}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="address"
                  label="Address"
                  id="address"
                  multiline
                  defaultValue={attributes.address}
                  rows={4}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loadingUpdateShop || !hasChange}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

interface AttributesPhoto {
  name: string;
  url: string;
}
interface DataPhoto {
  id: number;
  attributes: AttributesPhoto;
}

interface Photo {
  data: DataPhoto;
}

interface AttributesDetail {
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  photo: Photo;
}
interface ShopDetail {
  id: number;
  attributes: AttributesDetail;
}

interface ShopResponse {
  data: ShopDetail[];
  meta: { pagination: { page: 1; pageSize: 25; pageCount: 1; total: 1 } };
}

const defaultShop = {
  id: 0,
  attributes: {
    name: "",
    address: "",
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    photo: {
      data: {
        id: 0,
        attributes: {
          name: "",
          url: "",
        },
      },
    },
  },
};

export default function WrapperHome() {
  const [shopDetail, setShopDetail] = useState<ShopDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const handleShopDetail = async () => {
      setIsLoading(true);
      try {
        const resGetJwt = await axios.get<{ userId: string; jwt: string }>(
          `/api/get-jwt-cookie`
        );

        const userId = resGetJwt.data.userId;
        const jwt = resGetJwt.data.jwt;

        const query = qs.stringify(
          {
            filters: {
              users_permissions_user: {
                id: userId,
              },
            },
            populate: "*",
          },
          {
            encodeValuesOnly: true,
          }
        );

        const resGetDetailUser = await axios.get<ShopResponse>(
          `${SHOP_API}?${query}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        const getShopDetail = resGetDetailUser.data?.data?.[0] || defaultShop;

        // Pass data to the page via props
        setShopDetail(getShopDetail);
      } catch {
        setShopDetail(defaultShop);
      } finally {
        setIsLoading(false);
      }
    };
    handleShopDetail();
  }, []);

  if (isLoading || !shopDetail) {
    return null;
  }

  return <Home data={shopDetail} />;
}

// export const getServerSideProps: GetServerSideProps<{
//   data: ShopDetail;
// }> = async ({ req }) => {
//   // Fetch data from external API
//   const host = req?.headers.host;
//   const httpHost = `http://${req?.headers.host}`;
//   try {
//     const resGetJwt = await axios.get<{ userId: string; jwt: string }>(
//       `${host ? httpHost : ""}/api/get-jwt-cookie`,
//       {
//         headers: {
//           cookie: req?.headers.cookie,
//         },
//       }
//     );

//     const userId = resGetJwt.data.userId;
//     const jwt = resGetJwt.data.jwt;

//     const query = qs.stringify(
//       {
//         filters: {
//           users_permissions_user: {
//             id: userId,
//           },
//         },
//         populate: "*",
//       },
//       {
//         encodeValuesOnly: true,
//       }
//     );

//     const resGetDetailUser = await axios.get<ShopResponse>(
//       `${SHOP_API}?${query}`,
//       {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       }
//     );

//     const getShopDetail = resGetDetailUser.data?.data?.[0] || defaultShop;

//     // Pass data to the page via props
//     return { props: { data: getShopDetail } };
//   } catch {
//     return { props: { data: defaultShop } };
//   }
// };
