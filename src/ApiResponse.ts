import { ApiProperty } from "@nestjs/swagger";

export class ApiResponse {
  @ApiProperty()
   data: any;
  @ApiProperty()
   timestamp: Date;
  @ApiProperty()
   success: boolean;
  @ApiProperty()
   message: string;
  constructor(data: any= null, success: boolean = true) {
    this.data = data;
    this.timestamp = new Date();
    this.success = success;
    this.message = success
      ? 'Request Successfully completed'
      : 'Operation failed';
  }
}
