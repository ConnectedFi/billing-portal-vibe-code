type Rate =
  | {
      type: "prime-plus";
      value: number;
    }
  | {
      type: "fixed";
      rate: number;
    };

type Dealer = {
  id: string;
  name: string;
};

export type Tranche = {
    dealerId: Dealer;
  label: string;
  description: string;
  startDate: Date;
  endDate: Date;
  onBoardDate: Date;

  // use decimal to represent percentage: .67 == 67%
  retailerRate: Rate;
  // use decimal to represent percentage: .67 == 67%
  growerRate: Rate;
};
