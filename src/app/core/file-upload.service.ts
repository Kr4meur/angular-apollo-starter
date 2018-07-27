import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FetchResult } from 'apollo-link';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';

import { DataProxy } from 'apollo-cache';

import * as M from '../graphql/mutations';
import * as Q from '../graphql/queries';

@Injectable()
export class FileUploadService {
  constructor(private apollo: Apollo) {}

  public upload(files: FileList): Observable<FetchResult> {
    if (files.length > 1) {
      return this.mutipleUpload(files);
    }
    return this.apollo
      .mutate({
        mutation: M.SINGLE_UPLOAD,
        variables: {
          file: files[0]
        },
        update: (proxy: DataProxy, mutationResult: FetchResult<any>) => {
          const data: any = proxy.readQuery({ query: Q.UPLOADS });
          const {
            data: { singleUpload: newUpload }
          } = mutationResult;
          data.uploads.push(newUpload);
          proxy.writeQuery({ query: Q.UPLOADS, data });
        }
      })
      .map(res => {
        return res;
      });
  }

  public mutipleUpload(files: FileList): Observable<FetchResult> {
    return this.apollo
      .mutate({
        mutation: M.MULTIPLE_UPLOAD,
        variables: {
          files
        }
        // update: (proxy: DataProxy, mutationResult: FetchResult<any>) => {
        //   const data: any = proxy.readQuery({ query: Q.UPLOADS });
        //   const {
        //     data: { singleUpload: newUpload }
        //   } = mutationResult;
        //   data.uploads.push(newUpload);
        //   proxy.writeQuery({ query: Q.UPLOADS, data });
        // }
      })
      .map(res => {
        return res;
      });
  }

  public queryAll(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({ query: Q.UPLOADS }).valueChanges;
  }
}
