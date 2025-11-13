export class MobilePost {
  // @IsString()
  // @MaxLength(3)
// //    @FormGroupValidate(Validators.maxLength(3))
  mobileCode?: string;

//   @IsString()
//   @MaxLength(100)
////    @FormGroupValidate(Validators.maxLength(100))
  locationTC?: string;

//   @IsString()
//   @MaxLength(100)
////    @FormGroupValidate(Validators.maxLength(100))
  locationSC?: string;

//   @IsString()
//   @MaxLength(255)
//    @FormGroupValidate(Validators.maxLength(255))
  addressTC?: string;

//   @IsString()
//   @MaxLength(50)
//    @FormGroupValidate(Validators.maxLength(50))
  nameSC?: string;

//   @IsString()
//   @MaxLength(50)
//    @FormGroupValidate(Validators.maxLength(50))
  districtSC?: string;

//   @IsString()
//   @MaxLength(255)
//    @FormGroupValidate(Validators.maxLength(255))
  addressSC?: string;

//   @IsString()
//   @MaxLength(50)
//    @FormGroupValidate(Validators.maxLength(50))
  nameTC?: string;

//   @IsString()
//   @MaxLength(50)
//    @FormGroupValidate(Validators.maxLength(50))
  districtTC?: string;

//   @IsString()
//   @MaxLength(50)
//    @FormGroupValidate(Validators.maxLength(50))
  nameEN?: string;

//   @IsString()
//   @MaxLength(50)  
//    @FormGroupValidate(Validators.maxLength(50))
  districtEN?: string;

//   @IsString()
//   @MaxLength(100)
//    @FormGroupValidate(Validators.maxLength(100))
  locationEN?: string;

//   @IsString()
//   @MaxLength(255)
//    @FormGroupValidate(Validators.maxLength(255))
  addressEN?: string;

//   @IsNumber()
//   @Type(() => Number)
//   @Max(100)
//   @Min(1)
//    @FormGroupValidate(Validators.max(100), Validators.min(1))
  seq?: number;

//   @Max(5)
//   @Min(1)
//    @FormGroupValidate(Validators.max(5), Validators.min(1))
  dayOfWeekCode?: number;

//   @IsNumber({ maxDecimalPlaces: 5 })
//   @Type(() => Number) 
//   @Max(90)
//   @Min(-90)
//    @FormGroupValidate(Validators.max(90), Validators.min(-90))
  latitude?: number;

//   @IsNumber({ maxDecimalPlaces: 5 })
//   @Type(() => Number)
//   @Max(180)
//   @Min(-180)
//    @FormGroupValidate(Validators.max(180), Validators.min(-180))
  longitude?: number;

//   @Matches(TimeFormat)
// //    @FormGroupValidate(Validators.pattern(TimeFormat))
  closeHour?: string;

//   @Matches(TimeFormat)
// //    @FormGroupValidate(Validators.pattern(TimeFormat)) 
  openHour?: string;
}
