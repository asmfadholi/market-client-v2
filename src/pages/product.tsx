import { DataGrid, GridColDef } from "@mui/x-data-grid";

import {
  Box,
  Typography,
  Avatar,
  Stack,
  Card,
  Divider,
  IconButton,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";

import axios from "axios";
import QueryString from "qs";
import { Datum, ResponseProduct } from "@/types/product";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { ChangeEvent, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { getImage } from "@/helpers/getImage";
import { noop } from "@/helpers/noop";
import useAxios from "@/hooks/useAxios";
import { useSnackbarActions } from "@/contexts/snackbarContext";
import SearchIcon from "@mui/icons-material/Search";

import ModalCreationProduct from "@/components/product/components/ModalCreation";

interface ColumnsProps {
  onDelete: (arg: { id: number; uniqueName: string }) => void;
  onEdit: (arg: Datum) => void;
}

const columns = ({ onDelete, onEdit }: ColumnsProps): GridColDef<Datum>[] => [
  {
    field: "attributes.stock",
    headerName: "Stock",
    width: 50,
    flex: 1,
    align: "center",
    sortable: false,
    headerAlign: "center",
    renderCell: ({ row }) => {
      const { attributes } = row;
      const { stock } = attributes;

      return <Box>{stock}</Box>;
    },
  },
  {
    field: "attributes.name",
    headerName: "Nama Barang",
    sortable: false,
    minWidth: 300,
    flex: 1,
    headerAlign: "left",
    renderCell: ({ row }) => {
      const { attributes } = row;
      const { uniqueName } = attributes;

      return <Box fontWeight="bold">{uniqueName}</Box>;
    },
  },
  {
    field: "attributes.image",
    headerName: "Gambar",
    sortable: false,
    minWidth: 70,
    flex: 1,
    headerAlign: "left",
    renderCell: ({ row }) => {
      const { attributes } = row;
      const { image, uniqueName } = attributes;

      return (
        <Avatar
          alt={uniqueName}
          src={getImage(image.data?.attributes.url || "")}
          sx={{ width: "50px", height: "50px" }}
        />
      );
    },
  },
  {
    field: "attributes.price",
    headerName: "Harga Jual (Rp)",
    sortable: false,
    minWidth: 200,
    flex: 1,
    headerAlign: "right",
    renderCell: ({ row }) => {
      const { attributes } = row;
      const { price } = attributes;

      return (
        <Box textAlign="right" width="100%" fontWeight="bold">
          {Number(price).toLocaleString("id-ID")}
        </Box>
      );
    },
  },
  {
    field: "attributes.basePrice",
    headerName: "Harga Modal (Rp)",
    sortable: false,
    minWidth: 200,
    flex: 1,
    headerAlign: "right",
    renderCell: ({ row }) => {
      const { attributes } = row;
      const { basePrice } = attributes;

      return (
        <Box textAlign="right" width="100%">
          {Number(basePrice || "0").toLocaleString("id-ID")}
        </Box>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    sortable: false,
    flex: 1,
    headerAlign: "center",
    renderCell: ({ row }) => {
      const { id, attributes } = row;

      return (
        <Box width="100%" display="flex" justifyContent="center">
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => onEdit(row)}>
              <BorderColorIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                onDelete({ id, uniqueName: attributes.uniqueName })
              }
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        </Box>
      );
    },
  },
];

const PRODUCT_API = `${process.env.NEXT_PUBLIC_BASE_URL}/products`;

const Product = ({ data }: { data: ResponseProduct }) => {
  const getAxios = useAxios();

  const [rows, setRows] = useState(data.data);
  const { setShowSnackbar } = useSnackbarActions();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [search, setSearch] = useState("");
  const [openCreation, setOpenCreation] = useState(false);
  const [dataCreation, setDataCreation] = useState<Datum | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState({
    show: false,
    message: "" as string | JSX.Element,
    onConfirm: noop,
  });
  const [pagination, setPagination] = useState(data.meta.pagination);

  const handlePagination = async (model: {
    pageSize: number;
    page: number;
    uniqueName?: string;
  }) => {
    const query = QueryString.stringify(
      {
        filters: {
          // users_permissions_user: {
          //   id: detailUser.id,
          // },
          uniqueName: {
            $containsi: model?.uniqueName || "",
          },
        },
        populate: "*",
        pagination: {
          page: model.page,
          pageSize: model.pageSize,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    try {
      setLoadingPaginate(true);
      const resGetProduct = await getAxios().get<ResponseProduct>(
        `${PRODUCT_API}?${query}`
      );

      setRows(resGetProduct?.data?.data);
      setPagination(resGetProduct?.data?.meta?.pagination);
    } finally {
      setLoadingPaginate(false);
    }
  };

  const confirmedDelete = async (id: number) => {
    try {
      setLoadingDelete(true);
      const resDeleteProduct = await getAxios().delete<{
        data: { attributes: { uniqueName: string } };
      }>(`${PRODUCT_API}/${id}`);

      const uniqueName =
        resDeleteProduct?.data?.data?.attributes?.uniqueName || "";
      setShowSnackbar({
        show: true,
        message: `Barang "${uniqueName}" berhasil dihapus`,
        type: "success",
      });

      await handlePagination(pagination);
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
      setLoadingDelete(false);
      setOpenConfirmDelete((prev) => ({ ...prev, show: false }));
    }
  };

  const handleDelete = ({
    id,
    uniqueName,
  }: {
    id: number;
    uniqueName: string;
  }) => {
    setOpenConfirmDelete({
      show: true,
      onConfirm: () => confirmedDelete(id),
      message: (
        <Box>
          Apa kamu yakin ingin menghapus barang <b>&quot;{uniqueName}&quot;</b>?
        </Box>
      ),
    });
  };

  const handleEdit = (arg: Datum) => {
    setOpenCreation(true);
    setDataCreation(arg);
  };

  const handleSearch = (res: ChangeEvent<HTMLInputElement>) => {
    res.preventDefault();

    setSearch(String(res?.target?.value || ""));
  };

  return (
    <Card sx={{ padding: "24px" }}>
      <Typography variant="h6" component="h2" margin="0 0 12px">
        <Stack direction="row" spacing={1} alignItems="center">
          <InventoryIcon />
          <Box fontWeight="bold">Product</Box>
        </Stack>
      </Typography>

      <Divider sx={{ marginBottom: "24px" }} />

      <Box sx={{ marginBottom: "16px" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <TextField
            value={search}
            label="Cari nama barang"
            onChange={handleSearch}
            onKeyDown={(e) => {
              const code = e.code;

              if (code === "Enter") {
                handlePagination({
                  ...pagination,
                  uniqueName: search,
                });
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() =>
                    handlePagination({
                      ...pagination,
                      uniqueName: search,
                    })
                  }
                >
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              setOpenCreation(true);
              setDataCreation(null);
            }}
          >
            Tambah Barang
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 500, width: "100%", overflow: "auto" }}>
        <DataGrid
          loading={loadingPaginate}
          rowCount={pagination.total}
          rows={rows}
          columns={columns({ onDelete: handleDelete, onEdit: handleEdit })}
          rowHeight={65}
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.pageSize,
          }}
          onPaginationModelChange={(e, detail) => {
            if (detail.reason) {
              handlePagination({ ...e, page: e.page + 1 });
            }
          }}
          pageSizeOptions={[5, 20, 40, 80]}
          disableColumnFilter
          disableRowSelectionOnClick
          disableDensitySelector
          paginationMode="server"
          disableColumnMenu
        />
      </Box>

      <Box>
        <Dialog
          open={openConfirmDelete.show}
          onClose={() =>
            setOpenConfirmDelete((prev) => ({ ...prev, show: false }))
          }
          aria-labelledby="alert-dialog-delete"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-delete">
            {openConfirmDelete.message}
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Data barang yang terhapus akan hilang. Pastikan kembali barang
              yang akan anda hapus.
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ padding: "0 24px 24px" }}>
            <Button
              onClick={openConfirmDelete.onConfirm}
              color="error"
              variant="contained"
              disabled={loadingDelete}
            >
              Ya, Hapus
            </Button>
            <Button
              onClick={() =>
                setOpenConfirmDelete((prev) => ({ ...prev, show: false }))
              }
              autoFocus
            >
              Batalkan
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {openCreation && (
        <ModalCreationProduct
          open={openCreation}
          setOpen={setOpenCreation}
          data={dataCreation}
          onSuccess={() => handlePagination(pagination)}
        />
      )}
    </Card>
  );
};

// export const getServerSideProps: GetServerSideProps<{
//   data: ResponseProduct;
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

//     const query = QueryString.stringify(
//       {
//         filters: {
//           users_permissions_user: {
//             id: userId,
//           },
//         },
//         populate: "*",
//         pagination: {
//           page: 1,
//           pageSize: 5,
//         },
//       },
//       {
//         encodeValuesOnly: true,
//       }
//     );

//     const resGetProducts = await axios.get<ResponseProduct>(
//       `${PRODUCT_API}?${query}`,
//       {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       }
//     );

//     // Pass data to the page via props
//     return { props: { data: resGetProducts.data } };
//   } catch {
//     return {
//       props: {
//         data: {
//           data: [],
//           meta: {
//             pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 },
//           },
//         },
//       },
//     };
//   }
// };

function WrapperProduct() {
  const [products, setProducts] = useState<ResponseProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const handleShopDetail = async () => {
      setIsLoading(true);
      try {
        const resGetJwt = await axios.get<{ userId: string; jwt: string }>(
          `/api/get-jwt-cookie`
        );

        // const userId = resGetJwt.data.userId;
        const jwt = resGetJwt.data.jwt;

        const query = QueryString.stringify(
          {
            // filters: {
            //   users_permissions_user: {
            //     id: userId,
            //   },
            // },
            populate: "*",
            pagination: {
              page: 1,
              pageSize: 20,
            },
          },
          {
            encodeValuesOnly: true,
          }
        );

        const resGetProducts = await axios.get<ResponseProduct>(
          `${PRODUCT_API}?${query}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        // Pass data to the page via props
        setProducts(resGetProducts.data);
      } catch {
        setProducts({
          data: [],
          meta: {
            pagination: { page: 1, pageSize: 20, pageCount: 1, total: 1 },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };
    handleShopDetail();
  }, []);

  if (isLoading || !products) {
    return null;
  }

  return <Product data={products} />;
}

export default WrapperProduct;
