import { IsString, IsNotEmpty, IsOptional, Max, MaxLength, IsNumber, Min, Matches, Validate, ValidateIf } from "class-validator";
import { Type } from 'class-transformer';
import { TimeFormat,order } from "../../shared/constants/regex";


export class MobilePost {
//   @IsString()
//   @MaxLength(3)
  mobileCode?: string;

//   @IsString()
//   @MaxLength(100)
  locationTC?: string;

//   @IsString()
//   @MaxLength(100)
  locationSC?: string;

//   @IsString()
//   @MaxLength(255)
  addressTC?: string;

//   @IsString()
//   @MaxLength(50)
  nameSC?: string;

//   @IsString()
//   @MaxLength(50)
  districtSC?: string;

//   @IsString()
//   @MaxLength(255)
  addressSC?: string;

//   @IsString()
//   @MaxLength(50)
  nameTC?: string;

//   @IsString()
//   @MaxLength(50)
  districtTC?: string;

//   @IsString()
//   @MaxLength(50)
  nameEN?: string;

//   @IsString()
//   @MaxLength(50)  
  districtEN?: string;

//   @IsString()
//   @MaxLength(100)
  locationEN?: string;

//   @IsString()
//   @MaxLength(255)
  addressEN?: string;

//   @IsNumber()
//   @Type(() => Number)
//   @Max(100)
//   @Min(1)
  seq?: number;

//   @Max(5)
//   @Min(1)
  dayOfWeekCode?: number;

//   @IsNumber({ maxDecimalPlaces: 5 })
//   @Type(() => Number) 
//   @Max(90)
//   @Min(-90)
  latitude?: number;

//   @IsNumber({ maxDecimalPlaces: 5 })
//   @Type(() => Number)
//   @Max(180)
//   @Min(-180)
  longitude?: number;

//   @Matches(TimeFormat)
  closeHour?: string;

//   @Matches(TimeFormat)
  openHour?: string;
}
