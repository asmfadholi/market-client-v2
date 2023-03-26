import {
  Box,
  Avatar,
  Stack,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
  SxProps,
  Theme,
} from "@mui/material";

import axios from "axios";

import { Datum } from "@/types/product";

import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import Dialog from "@mui/material/Dialog";
import { getImage } from "@/helpers/getImage";

import { useSnackbarActions } from "@/contexts/snackbarContext";

import { NumericFormat, NumericFormatProps } from "react-number-format";

interface ModalCreationProductProps {
  data: Datum | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator="."
        decimalSeparator=","
        valueIsNumericString
        prefix="Rp. "
      />
    );
  }
);
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

const styAvatar: SxProps<Theme> = {
  width: "150px",
  height: "150px",
};

const defaultErrorFormat =
  "Unsupported file format, only .jpg, .jpeg, .png or svg are supported";

const ModalCreationProduct = ({
  data,
  open,
  setOpen,
}: ModalCreationProductProps) => {
  //   const getAxios = useAxios();
  const refInput = useRef<HTMLInputElement>(null);
  //   const { detailUser } = useAuthStates();
  const [hasChange, setHasChange] = useState(false);
  const { setShowSnackbar } = useSnackbarActions();
  const [file, setFile] = useState<File[]>([]);
  const [image, setImage] = useState("");

  const isEdit = Boolean(data);
  const titleText = isEdit ? "Edit Barang" : "Tambah Barang";
  const attributes = data?.attributes;
  const { name, stock, price, basePrice, productId, unit } = attributes || {};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setLoadingShop(true);
    const dataForm = new FormData(event.currentTarget);
    console.log(dataForm.get("price"), "dataForm");
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
      //   await getAxios().put(`${SHOP_API}/${data.id}`, requestForm);
      setShowSnackbar({
        show: true,
        message: "successUpdateShop",
        type: "success",
      });
      setHasChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const getDataError = err.response?.data as {
          error: { message: string };
        };
        setShowSnackbar({
          show: true,
          message: getDataError?.error?.message,
          type: "error",
        });
      }
    } finally {
      //   setLoadingUpdateShop(false);
    }
  };

  const handleChangeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
      setHasChange(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-delete"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-delete">{titleText}</DialogTitle>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        onChange={() => setHasChange(true)}
        sx={{ mt: 1, maxWidth: "800px" }}
      >
        <DialogContent>
          <Stack
            justifyContent="center"
            alignItems="center"
            direction="column"
            marginBottom="24px"
          >
            <Avatar
              alt={attributes?.image.data?.attributes.name || "0"}
              src={
                image || getImage(attributes?.image.data?.attributes?.url || "")
              }
              sx={styAvatar}
            />
            <label htmlFor="contained-button-file">
              <Box sx={styButtonUpload}>Foto Barang</Box>

              <Box fontSize={12} textAlign="center">
                (.jpg, .jpeg, .png or .svg)
              </Box>

              <input
                ref={refInput}
                style={{ display: "none" }}
                onChange={handleChangeUpload}
                accept="image/*"
                data-testid="uploadImage"
                id="contained-button-file"
                multiple={false}
                type="file"
              />
            </label>
          </Stack>

          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nama Barang"
            name="name"
            defaultValue={name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Harga Barang"
            name="price"
            InputProps={{
              inputComponent: NumericFormatCustom as any,
            }}
            defaultValue={price}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="basePrice"
            label="Harga Modal"
            name="basePrice"
            InputProps={{
              inputComponent: NumericFormatCustom as any,
            }}
            defaultValue={basePrice}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="unit"
            label="Satuan"
            placeholder="ex: Dus / Pack / Renceng"
            id="unit"
            defaultValue={unit}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="stock"
            label="Stok"
            name="stock"
            InputProps={{
              type: "number",
            }}
            defaultValue={stock}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="productId"
            label="Barcode"
            name="productId"
            defaultValue={productId}
          />
        </DialogContent>

        <DialogActions>
          <Box padding="16px">
            <Button type="submit" disabled={!hasChange} variant="contained">
              Simpan
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalCreationProduct;
