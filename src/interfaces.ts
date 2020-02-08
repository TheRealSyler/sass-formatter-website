interface npmUser {
  name: string;
  email: string;
}

export interface npmRegistry {
  _id: string;
  _rev: string;
  name: string;
  'dist-tags': {
    [key: string]: string;
  };
  versions: {
    [key: string]: {
      name: string;
      version: string;
      description: string;
      main: string;
      scripts: {
        [key: string]: string;
      };
      keywords: string[];
      author: {
        name: string;
      };
      licence: string;
      devDependencies: {
        [key: string]: string;
      };
      gitHead: string;
      _id: string;
      _npmVersion: string;
      nodeVersion: string;
      npmUser: npmUser;
      dist: {
        integrity: string;
        shasum: string;
        tarball: string;
        fileCount: number;
        unpackedSize: number;
        'npm-signature': string;
      };
      maintainers: npmUser[];
      directories: {
        bin: string;
        doc: string;
        example: string;
        lib: string;
        man: string;
        test: string;
      };
      _npmOperationalInternal: {
        host: string;
        tmp: string;
        _hasShrinkwrap: boolean;
      };
    };
  };
  time: {
    [key: string]: string;
  };
  maintainers: npmUser[];
  description: string;
  keywords: string[];
  author: {
    name: string;
  };
  licence: string;
  readme: string;
  readmeFilename: string;
  homepage: string;
  repository: {
    type: string;
    url: string;
  };
  bugs: {
    url: string;
  };
}
