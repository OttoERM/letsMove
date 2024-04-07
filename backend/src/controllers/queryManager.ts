interface options {
  limit: number;
  skip: number;
}

enum paginationOptions {
  limit = "limit",
  skip = "skip",
}

type indexSign = {
  [key: string]: string | number | object;
};

class queryManager {
  private filterMap = new Map();
  private optionsMap = new Map();

  constructor(
    queryParams: object,
    filterParams: Array<string>,
    optionsParams?: Array<string>
  ) {
    if (!queryParams) return;

    const requestedProperties = Object.getOwnPropertyNames(queryParams);

    this.checkDuplicateEntries(filterParams, optionsParams);

    if (filterParams.length != 0) {
      filterParams.forEach((param) => {
        if (requestedProperties.includes(param))
          this.filterMap.set(param, (queryParams as any)[param]);
      });
    }

    if (optionsParams && optionsParams.length != 0) {
      optionsParams.forEach((param) => {
        if (requestedProperties.includes(param))
          this.optionsMap.set(param, Number((queryParams as any)[param]));
      });
    }
  }

  private checkDuplicateEntries(
    filterParams: string[],
    optionsParams: string[] | undefined
  ): void {
    if (!optionsParams) return;

    if (filterParams.length == 0 || optionsParams.length == 0) return;

    filterParams.forEach((param) => {
      if (optionsParams.includes(param))
        throw new Error(
          "Parameter for filter and options contains one or more same properties"
        );
    });
  }

  public getFilter() {
    let filter: indexSign = {};

    for (const [key, value] of this.filterMap) {
      if (typeof value === "string" && value.includes(",")) {
        filter[key] = {
          $in: [...value.split(",")],
        };
      } else filter[key] = value;
    }

    return filter;
  }

  public getOptions() {
    let filter: any = {};

    for (const [key, value] of this.optionsMap) {
      filter[key] = value;
    }

    return filter;
  }
}

export { paginationOptions, options, queryManager };

//Add to unit testing
// const req = {
//   query: {
//     "tags": "principiante",
//     // "tags": "principiante,brazos",
//     "blabal": "injection",
//     "exercise.activity": "Flexiones",
//     "limit": 58,
//   },
// };

// const qM = new queryManager(
//   req.query,
//   ["tags", "exercise.activity"],
//   ["limit"]
// );

// console.log(qM.getFilter());
// console.log(qM.getFilter().tags);
// console.log(qM.getOptions());
