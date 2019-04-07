import * as React from 'react';
import axios from 'axios';
import { API } from 'aws-amplify';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import { isArray } from "lodash";
import "./FormList.scss";
import FormNew from "../FormNew/FormNew";
import { connect } from 'react-redux';
import dataLoadingView from "../util/DataLoadingView";
import { IFormListProps, IFormListState } from "./FormList.d";
import { loadFormList, createForm } from '../../store/admin/actions';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import history from "../../history";

const mapStateToProps = state => ({
    ...state.auth,
    ...state.admin
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    loadFormList: () => dispatch(loadFormList()),
    createForm: (e) => dispatch(createForm(e))
});


class FormList extends React.Component<IFormListProps, IFormListState> {
    constructor(props: any) {
        super(props);
        this.render = this.render.bind(this);
        console.log(props);
        this.state = {
            formList: []
        }
    }
    componentDidMount() {
        this.props.loadFormList();
    }
    showEmbedCode(formId) {

    }

    delete(forms,formId) {
        if (confirm("Are you sure you want to delete this form (this cannot be undone)?")) {
            API.del("CFF", `/forms/${formId}`, {}).then(e => {
                alert("Form deleted!");
                window.location.reload();
            }).catch(e => {
                alert(`Delete failed: ${e}`);
            });
        }
    }

    render() {
        let formList = this.props.selectedForm ? [this.props.selectedForm] : this.props.formList;

        if (!formList) {
            return <div>Loading</div>;
        }
        return (
            <table className="ccmt-cff-form-list table table-sm table-responsive-sm">
                <thead>
                    <tr>
                        <th>Right click on a form to perform an action.</th>
                        <th>
                            <FormNew onError={this.props.onError} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {formList && formList.length == 0 && <tr><td>No forms found.</td></tr>}
                    {formList && formList.map((form) =>
                        <React.Fragment key={form["_id"]["$oid"]}>
                            <ContextMenuTrigger id={form["_id"]["$oid"]}>
                                <tr key={form["_id"]["$oid"]}>
                                    <td className="ccmt-cff-form-list-name">{form["name"]}<br />
                                        <small title={form["schemaModifier"] ? `s: ${form["schema"]["id"]} v${form["schema"]["version"]};\n sM: ${form["schemaModifier"]["id"]} v${form["schemaModifier"]["version"]}` : ""}>
                                            <code>{form["_id"]["$oid"]}</code>
                                        </small>
                                    </td>
                                    <td>

                                    </td>
                                </tr>
                            </ContextMenuTrigger>
                            <ContextMenu id={form["_id"]["$oid"]}>
                                <MenuItem data={{ foo: 'View' }} onClick={() =>
                                    history.push({ pathname: `/v2/forms/${form["_id"]["$oid"]}`, state: { selectedForm: form } })}>
                                    <span className="oi oi-document" />&nbsp;View
 			                </MenuItem>
                                <MenuItem data={{ foo: 'Embed' }} onClick={() => history.push({ pathname: `./${form["_id"]["$oid"]}/embed/`, state: { selectedForm: form } })}>
                                    <span className="oi oi-document" />&nbsp;Embed
                            </MenuItem>
                                <MenuItem divider />
                                <MenuItem data={{ foo: 'Edit' }} onClick={() =>
                                    history.push({ pathname: `./${form["_id"]["$oid"]}/edit/`, state: { selectedForm: form } })}>
                                    <span className="oi oi-pencil" />&nbsp;Edit
                            </MenuItem>
                                <MenuItem data={{ foo: 'Responses' }} onClick={() =>
                                    history.push({ pathname: `./${form["_id"]["$oid"]}/responses/`, state: { selectedForm: form } })}>
                                    <span className="oi oi-sort-ascending" />&nbsp;Responses
                            </MenuItem>
                                <MenuItem data={{ foo: 'Share' }} onClick={() =>
                                    history.push({ pathname: `./${form["_id"]["$oid"]}/share/`, state: { selectedForm: form } })}>
                                    <span className="oi oi-share-boxed" />&nbsp;Share
                            </MenuItem>
                            <MenuItem data={{ foo: 'Duplicate' }} onClick={() =>
                                    this.props.createForm(form._id.$oid)}>
                                    <span className="oi oi-plus" />&nbsp;
                                    Duplicate
                            </MenuItem>
                            <MenuItem data={{ foo: 'Delete' }} onClick={() => {this.delete(formList,form["_id"]["$oid"])}}>
                                   <span className="oi oi-minus" />&nbsp;
                                    Delete
                            </MenuItem>
                            </ContextMenu>
                        </React.Fragment>
                    )}
                </tbody>
            </table>
        )
    }
}

function ActionButton(props) {
    let disabled = props.disabled || !hasPermission(props.form.cff_permissions, props.permissionName, props.userId);
    if (!props.permissionName) {
        disabled = false;
    }

    if (disabled) {
        return (<a href="">
            <button className="ccmt-cff-btn-action" disabled={true}>
                <span className={`oi ${props.icon}`}></span> {props.text}
            </button>
        </a>);
    }
    else {
        return (<NavLink to={{ pathname: `${props.url}`, state: { selectedForm: props.form } }}>
            <button className="ccmt-cff-btn-action">
                <span className={`oi ${props.icon}`}></span> {props.text}
            </button>
        </NavLink>);
    }
}
function hasPermission(cff_permissions, permissionNames, userId) {
    if (!isArray(permissionNames)) {
        permissionNames = [permissionNames];
    }
    permissionNames.push("owner");
    if (cff_permissions && cff_permissions[userId]) {
        for (let permissionName of permissionNames) {
            if (cff_permissions[userId][permissionName] == true) {
                return true;
            }
        }
        return false;
    }
    return false;
}

const FormListWrapper = connect(mapStateToProps, mapDispatchToProps)(FormList);
export default FormListWrapper;