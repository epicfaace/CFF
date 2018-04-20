interface IFormListItem {
    name: string,
    id: string,
    version: number,
    schema: any,
    schemaModifier: any,
    cff_permissions: {[x: string]: string[]},
    date_last_modified: string,
    date_created: string
}


interface IFormListState {
    formList: IFormListItem[]
}


interface IFormListProps extends ISharedAdminProps {
    match: {
        url: string,
        params: {
            centerName: string,
            centerId: number
        }
    },
    onError: (any) => void,
    userId: string
}