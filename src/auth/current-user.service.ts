import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Injectable({scope: Scope.REQUEST})
export class CurrentUserService {
  private username: string;
  constructor(@Inject(REQUEST) private request: any) {}
  setUsername(username: string) {
    this.username = username;
  }
  getUsername(): string {
    return this.username;
  }
}
