type Rate =
  | {
      type: "prime-plus";
      value: number;
    }
  | {
      type: "fixed";
      rate: number;
    };


