export const PLACEHOLDER_COLUMNS = [
  {
    field: '__loading__',
    headerName: '',
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    resizable: false,
    renderHeader: () => null,
    renderCell: () => null,
  },
];

export const HEADS = [
    {
        "field": "id",
        "type": "number",
        "width": null,
        "flex": 1,
        "sortable": true,
        "filterable": false,
        "hide": true,
        "hideable": false,
        "disableColumnMenu": false
    },
    {
        "field": "sampling",
        "type": null,
        "width": null,
        "flex": 1,
        "sortable": true,
        "filterable": false,
        "hide": true,
        "hideable": false,
        "disableColumnMenu": false
    },
    {
        "field": "monitor_info",
        "type": null,
        "width": null,
        "flex": 1,
        "sortable": true,
        "filterable": false,
        "hide": true,
        "hideable": false,
        "disableColumnMenu": false
    },
    {
        "field": "name",
        "type": "text",
        "flex": 1,
        "sortable": true,
        "filterable": true,
        "hide": "",
        "hideable": false,
        "disableColumnMenu": false
    },
    {
        "field": "description",
        "type": "text",
        "flex": 2,
        "sortable": true,
        "filterable": true,
        "hide": false,
        "hideable": true,
        "disableColumnMenu": false
    },
    {
        "field": "created_by",
        "type": "text",
        "width": null,
        "flex": 1,
        "sortable": true,
        "filterable": false,
        "hide": true,
        "hideable": true,
        "disableColumnMenu": false
    },
    {
        "field": "creation_time",
        "type": "text",
        "width": 190,
        "sortable": true,
        "filterable": true,
        "hide": false,
        "disableColumnMenu": false
    },
    {
        "field": "update_time",
        "type": "text",
        "width": 190,
        "sortable": true,
        "filterable": true,
        "hide": false,
        "hideable": true,
        "disableColumnMenu": false
    },
    {
        "field": "actions",
        "type": null,
        "width": 190,
        "sortable": false,
        "filterable": false,
        "hide": false,
        "hideable": false,
        "disableColumnMenu": true,
        "actionCell": true,
        "actionCellType": "actions"
    }
]

export const visibilityModel = () => {
    return HEADS.reduce((model, head) => {
        model[head.field] = !Boolean(head.hide)
        return model
    }, {})
}