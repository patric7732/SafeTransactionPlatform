import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import TransacDetailReceipt from "./TransacDetailReceipt";
import {
  useSDK,
  useContract,
  useAddress,
  useContractEvents,
} from "@thirdweb-dev/react";
import { getReceipt } from "../../contract/getEvents";
import { ethers } from "ethers";
import {
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Modal,
} from "@mui/material";

import classes from "../../styles/receipt/ReleaseReceipt.module.css";
import { Close as CloseIcon, ThreeSixty } from "@mui/icons-material";
import { useSnackbar } from "notistack";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "13px",
    width: "1400px",
    margin: 0,
  },
  "& .MuiPaper-root": {
    borderRadius: "13px",
    maxWidth: "1400px !important",
    margin: 0,
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const DepositReciept = (props) => {
  const sdk = useSDK();
  const { contract } = useContract(contractAddress);
  const address = useAddress();
  const {
    data: eventDeposit,
    isLoading,
    error,
  } = useContractEvents(contract, "EscrowDeposit", {
    queryFilter: {
      filters: {
        buyer: props.address,
        // productId: +props.productId,
      },
      fromBlock: 0,
      order: "desc",
    },
  });
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("TransacDetailReceipt");
  const [txData, setTxData] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    props.onClose();
  };

  const getTxReciept = async () => {
    const filter = {
      buyer: props.address,
    };
    const logs = await getReceipt(sdk, "EscrowDeposit", filter);
    const filteredLogs = await logs.filter((log) => {
      return log?.data.productId._hex == "0x" + props.productId.toString(16);
    });
    return filteredLogs;
  };

  useEffect(() => {
    if (!props.open) return;
    getTxReciept().then((data) => setTxData(data[0] || []));
  }, [props.open]);

  // useEffect(() => {
  //   if (location.state && location.state.activeMenu)
  //     setActiveMenu(location.state.activeMenu);
  // }, [location.state]);

  const onMenuHandler = (menu) => {
    setActiveMenu(menu);
  };
  return (
    <Fragment>
      <div>
        <BootstrapDialog
          aria-labelledby="customized-dialog-title"
          open={props.open || false}
          onClose={handleClose}
          // disableEnforceFocus
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            style={{ padding: "15px 30px 15px 30px" }}
          >
            구매진행내역
          </BootstrapDialogTitle>

          <div className={classes.userInfoMenu}>
            <Button onClick={() => onMenuHandler("TransacDetailReceipt")}>
              <div
                className={`${classes.menuButton1} ${
                  activeMenu === "TransacDetailReceipt" ? classes.active : ""
                }`}
              >
                <span>거래내역(영수증)</span>
              </div>
            </Button>

            <Button onClick={() => onMenuHandler("TransactInfo")}>
              <div
                className={`${classes.menuButton} ${
                  activeMenu === "TransactInfo" ? classes.active : ""
                }`}
              >
                <span>트랜잭션 정보</span>
              </div>
            </Button>
          </div>

          <div className={classes.userInfoExplanation}>
            {activeMenu === "TransacDetailReceipt" && (
              <TransacDetailReceipt txData={txData} />
            )}
            {/* {activeMenu === "TransactInfo" && (
              <TransactInfo />
            )} */}
          </div>
        </BootstrapDialog>
      </div>
    </Fragment>
  );
};

export default DepositReciept;
