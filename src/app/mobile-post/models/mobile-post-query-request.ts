export class MobilePostQueryRequest{
//   @Transform(({ value }) => Array.isArray(value) ? value : [value])
//   @IsArray()
//   @IsString({ each: true })
//   @MaxLength(3, { each: true })
//   @IsOptional()
//   @AddToFilter()
//   @IsNotEmpty({ each: true })
  mobileCode?: string[];

//   @IsString()
//   @IsOptional()
//   @SearchFrom(['locationTC', 'locationSC', 'locationEN'])
//   @MaxLength(100)
//   @IsNotEmpty({ each: true })
  location?: string;


//   @IsString()
//   @IsOptional()
//   @SearchFrom(['addressTC', 'addressSC', 'addressEN'])
//   @MaxLength(255)
//   @IsNotEmpty()
  address?: string;

//   @IsString()
//   @IsOptional()
//   @SearchFrom(['nameTC', 'nameSC', 'nameEN'])
//   @MaxLength(50)
//   @IsNotEmpty()
  name?: string;

//   @IsString()
//   @IsOptional()
//   @SearchFrom(['districtTC', 'districtSC', 'districtEN'])
//   @MaxLength(50)
//   @IsNotEmpty()
  district?: string;

//   @Transform(({ value }) => Array.isArray(value) ? value : [value])
//   @IsArray()
//   @IsOptional()
//   @AddToFilter()
//   @Type(() => Number)
//   @IsInt({ each: true })
//   @Min(1, { each: true })
//   @Max(100, { each: true })
//   @IsNotEmpty({ each: true })
  seq?: number[];

//   @Transform(({ value }) => Array.isArray(value) ? value : [value])
//   @IsArray()
//   @IsOptional()
//   @AddToFilter()
//   @Type(() => Number)
//   @IsInt({ each: true })
//   @Min(1, { each: true })
//   @Max(5, { each: true })
//   @IsNotEmpty({ each: true })
  dayOfWeekCode?: number[];

//   @Transform(({ value }) => Array.isArray(value) ? value : [value])
//   @IsArray()
//   @IsOptional()
//   @AddToFilter()
//   @Type(() => Number)
//   @IsInt({ each: true })
//   @IsNotEmpty({ each: true })
  id?: number[];

//   @IsOptional()
//   @AddToFilter()
//   @Type(() => Number)
//   @IsNumber({ maxDecimalPlaces: 5 })
//   @Min(-90)
//   @Max(90)
//   @IsNotEmpty()
  latitude?: number;

//   @IsOptional()
//   @AddToFilter()
//   @Type(() => Number)
//   @IsNumber({ maxDecimalPlaces: 5 })
//   @Min(-180)
//   @Max(180)
//   @IsNotEmpty()
  longitude?: number;

  // @AddToFilter()
  // closeHour?: string;

  // @AddToFilter()
  // openHour?: string;

//   @IsOptional()
//   @SearchByRange('closeHour', true, SupportDataType.TIME)
//   @Matches(TimeFormat)
//   @IsNotEmpty()
  closeHourStart?: string;

//   @IsOptional()
//   @SearchByRange('closeHour', false, SupportDataType.TIME)
//   @Matches(TimeFormat)
//   @IsTimeRangeValid('closeHourStart', 'closeHourEnd', { message: 'closeHourStart must be less than closeHourEnd' })
//   @IsNotEmpty()
  closeHourEnd?: string;

//   @IsOptional()
//   @SearchByRange('openHour', true, SupportDataType.TIME)
//   @Matches(TimeFormat)
//   @IsNotEmpty()
  openHourStart?: string;

//   @IsOptional()
//   @SearchByRange('openHour', false, SupportDataType.TIME)
//   @Matches(TimeFormat)
//   @IsTimeRangeValid('openHourStart', 'openHourEnd', { message: 'openHourStart must be less than openHourEnd' })
//   @IsNotEmpty()
  openHourEnd?: string;

  
//   @IsString()
//   @IsOptional()
//   @SearchFrom(['locationTC', 'locationSC', 'locationEN', 'addressTC', 'addressSC', 'addressEN', 'nameTC', 'nameSC', 'nameEN', 'districtTC', 'districtSC', 'districtEN'])
//   @MaxLength(255)
//   @IsNotEmpty()
  keyword?: string;

//   @IsOptional()
//   @IsInt()
//   @Type(() => Number)
//   @Min(1)
//   @IsNotEmpty()
  page: number = 1;

//   @IsOptional()
//   @IsInt()
//   @Type(() => Number)
//   @Min(1)
//   @IsNotEmpty()
  limit: number = 10;


//   @SortBy('order')
//   @IsOptional()
//   @IsString()
//   @ValueIsOneOfField(MobilePostOffice)
//   @IsNotEmpty()
  orderBy?: string;

//   @IsOptional()
//   @IsString()
//   @Matches(order)
//   @IsNotEmpty()
  order?: string;


}