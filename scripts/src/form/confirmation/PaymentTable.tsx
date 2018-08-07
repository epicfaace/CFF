import * as React from 'react';
import ReactTable from 'react-table';
import { IPaymentTableProps } from "./PaymentTable.d";
import {IPaymentInfo} from "../interfaces";

class PaymentTable extends React.Component<IPaymentTableProps, any> {
    constructor(props: any) {
        super(props);
    }

    formatPayment(total, currency = "USD") {
        if (Intl && Intl.NumberFormat) {
            return Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(total);
        }
        else {
            return total + " " + currency;
        }
    }
    formatPaymentInfo(paymentInfo: IPaymentInfo) {
        return this.formatPayment(paymentInfo.total, paymentInfo.currency);
    }
    render() {
        let tableHeaders = [
            {
                Header: "Name",
                accessor: "name"
            },
            {
                Header: "Description",
                accessor: "description"
            },
            {
                Header: "Amount",
                id: "amount",
                maxWidth: 150,
                accessor: d => this.formatPayment(d.amount, this.props.paymentInfo.currency)
            },
            {
                Header: "Quantity",
                accessor: "quantity",
                maxWidth: 100
            }
        ];
        let tableData = this.props.paymentInfo.items;
        return (
            <div>
                {this.props.paymentInfo &&
                    <div className="mb-2">
                        <ReactTable columns={tableHeaders} data={tableData}
                            minRows={0}
                            showPagination={false}
                            className="my-4" />
                        Total Amount: {this.formatPaymentInfo(this.props.paymentInfo)}
                    </div>
                }
            </div>
        );
    }
}
export default PaymentTable;