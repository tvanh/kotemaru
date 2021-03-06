package org.kotemaru.sqlhelper;

public class ColumnMetaBase implements ColumnMeta {


	private TableMeta tableMeta;
	private String columnName;
	private Integer dataType; // SQL型
	//TYPE_NAME String => データソース依存の型名。UDT の場合、型名は完全指定
	private Integer columnSize; //COLUMN_SIZE int => 列サイズ

	private Integer decimalDigits; // 小数点以下の桁数。DECIMAL_DIGITS が適用できないデータ型の場合は、Null が返される。
	private Integer nullable; // NULL は許されるか
        //columnNoNulls - NULL 値を許さない可能性がある
        //columnNullable - 必ず NULL 値を許す
        //columnNullableUnknown - NULL 値を許すかどうかは不明
    //REMARKS String => コメント記述列 (null の可能性がある)
	private String columnDef ;// 列のデフォルト値。単一引用符で囲まれた値は、文字列として解釈されなければならない (null の可能性がある)
	private Integer charOctetLength; // char の型については列の最大バイト数
    //ORDINAL_POSITION int => テーブル中の列のインデックス (1 から始まる)
    //IS_NULLABLE String => 列で NULL 値を許可するかどうかの判断に ISO 規則が使用される。
    //    YES --- パラメータが NULL を許可する場合
    //    NO --- パラメータが NULL を許可しない場合
    //    空の文字列 --- パラメータが NULL 値を許可するかどうか不明である場合
    //SCOPE_CATLOG String => 参照属性のスコープであるテーブルのカタログ (DATA_TYPE が REF でない場合は null)
    //SCOPE_SCHEMA String => 参照属性のスコープであるテーブルのスキーマ (DATA_TYPE が REF でない場合は null)
    //SCOPE_TABLE String => 参照属性のスコープであるテーブル名 (DATA_TYPE が REF でない場合は null)
    //SOURCE_DATA_TYPE short => 個別の型またはユーザー生成 Ref 型、java.sql.Types の SQL 型のソースの型 (DATA_TYPE が DISTINCT またはユーザー生成 REF でない場合は null)
	private String isAutoincrement; // この列が自動インクリメントされるかどうかを示す
        //YES --- 列が自動インクリメントされる場合
        //NO --- 列が自動インクリメントされない場合
        //空の文字列 --- 列が自動インクリメントされるかどうかが判断できない場合、パラメータは不明




	public ColumnMetaBase(TableMeta tableMeta, String columnName,
				Integer dataType, Integer columnSize, Integer decimalDigits,
				Integer nullable, String columnDef, Integer charOctetLength,
				String isAutoincrement) {
			super();
			this.tableMeta = tableMeta;
			this.columnName = columnName;
			this.dataType = dataType;
			this.columnSize = columnSize;
			this.decimalDigits = decimalDigits;
			this.nullable = nullable;
			this.columnDef = columnDef;
			this.charOctetLength = charOctetLength;
			this.isAutoincrement = isAutoincrement;
	}

	@Override
	public ColumnMeta as(String name) {
		ColumnMeta delegate = new ColumnMetaDelegate(this);
		delegate.setAsName(name);
		delegate.setValue(this.getValue());
		return delegate;
	}
	@Override
	public ColumnMeta value(Object val) {
		ColumnMeta delegate = new ColumnMetaDelegate(this);
		delegate.setAsName(this.getAsName());
		delegate.setValue(val);
		return delegate;
	}

	public String toString() {
		return this.getParamName()+"="+this.getValue();
	}


	//---------------------------------------------------------
	// setter/getter
	@Override
	public TableMeta getTableMeta() {
		return tableMeta;
	}

	@Override
	public void setTableMeta(TableMeta tableMeta) {
		this.tableMeta = tableMeta;
	}

	@Override
	public String getColumnName() {
		return columnName;
	}

	@Override
	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	@Override
	public Integer getDataType() {
		return dataType;
	}

	@Override
	public void setDataType(Integer dataType) {
		this.dataType = dataType;
	}

	@Override
	public Integer getColumnSize() {
		return columnSize;
	}

	@Override
	public void setColumnSize(Integer columnSize) {
		this.columnSize = columnSize;
	}

	@Override
	public Integer getDecimalDigits() {
		return decimalDigits;
	}

	@Override
	public void setDecimalDigits(Integer decimalDigits) {
		this.decimalDigits = decimalDigits;
	}

	@Override
	public Integer getNullable() {
		return nullable;
	}

	@Override
	public void setNullable(Integer nullable) {
		this.nullable = nullable;
	}

	@Override
	public String getColumnDef() {
		return columnDef;
	}

	@Override
	public void setColumnDef(String columnDef) {
		this.columnDef = columnDef;
	}

	@Override
	public Integer getCharOctetLength() {
		return charOctetLength;
	}

	@Override
	public void setCharOctetLength(Integer charOctetLength) {
		this.charOctetLength = charOctetLength;
	}

	@Override
	public String getIsAutoincrement() {
		return isAutoincrement;
	}

	@Override
	public void setIsAutoincrement(String isAutoincrement) {
		this.isAutoincrement = isAutoincrement;
	}

	@Override
	public String getAsName() {
		return null;
	}

	@Override
	public void setAsName(String asName) {
		throw new UnsupportedOperationException("use as() method");
	}

	@Override
	public Object getValue() {
		return null;
	}

	@Override
	public void setValue(Object value) {
		throw new UnsupportedOperationException("use value() method");
	}

	@Override
	public String getParamName() {
		if (getAsName() != null) return getAsName();
		return getColumnName();
	}

}
