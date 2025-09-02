export type Table = {
    name: string;
    description: string;
    columns: Column[];
}

export type Column = {
    name: string;
    type: ColumnType;
    nullable?: boolean;
}

export type ColumnType = "int16" | "int32" | "int64" | "string" | "date"

export const describeTable = (table: Table) => {
    return `This table name is "${table.name}" and contains "${table.description}".
    It has ${table.columns.length} columns.
    ${table.columns.map(column => `     - ${column.name}: ${column.type}`).join("\n")}`;
}

export const legoSets: Table = {
    name: "lego_sets",
    description: "All of the LEGO sets released by LEGO",
    columns: [
        { name: "_set_id", type: "string" },
        { name: "name", type: "string" },
        { name: "year", type: "int32" },
        { name: "theme", type: "string" },
        { name: "subtheme", type: "string", nullable: true },
        { name: "themegroup", type: "string" },
        { name: "category", type: "string" },
        { name: "pieces", type: "int32", nullable: true },
        { name: "minifigs", type: "string", nullable: true },
        { name: "agerange_min", type: "string", nullable: true },
        { name: "us_retailprice", type: "string", nullable: true },
        { name: "brickseturl", type: "string" },
        { name: "thumbnailurl", type: "string", nullable: true },
        { name: "imageurl", type: "string", nullable: true }
    ],
};

export const usGovernmentSpending: Table = {
    name: "us_government_spending",
    description: "US Government Spending",
    columns: [
        { name: "record_date", type: "date" },
        { name: "parent_id", type: "string" },
        { name: "classification_id", type: "int64" },
        { name: "classification_description", type: "string" },
        { name: "current_month_gross_outlay_amount", type: "string" },
        { name: "current_month_app_receipts_amount", type: "string" },
        { name: "current_month_net_outlays_amount", type: "string" },
        { name: "current_fiscal_year_to_date_gross_outlays_amount", type: "string" },
        { name: "current_fiscal_year_to_date_app_receipts_amount", type: "string" },
        { name: "current_fiscal_year_to_date_net_outlays_amount", type: "string" },
        { name: "prior_fiscal_year_to_date_gross_outlays_amount", type: "string" },
        { name: "prior_fiscal_year_to_date_app_receipts_amount", type: "string" },
        { name: "prior_fiscal_year_to_date_net_outlays_amount", type: "string" },
        { name: "table_number", type: "int16" },
        { name: "source_line_number", type: "int32" },
        { name: "print_order_sequence_number", type: "int32" },
        { name: "line_code_number", type: "int32" },
        { name: "data_type_code", type: "string" },
        { name: "record_type_code", type: "string" },
        { name: "sequence_level_number", type: "int16" },
        { name: "sequence_number_code", type: "string" },
        { name: "fiscal_year", type: "int32" },
        { name: "fiscal_quarter_number", type: "int16" },
        { name: "calendar_year", type: "int32" },
        { name: "calendar_quarter_number", type: "int16" },
        { name: "calendar_month_number", type: "int16" },
        { name: "calendar_day_number", type: "int16" }
    ],
};

