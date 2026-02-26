import {ProductsStoreModel} from '../models/products-store.model';

export const mockedProductsStore: ProductsStoreModel = {
  UpdatedAt: '2026-02-26T13:10:00Z',
  Products: [
    {
      Id: 'polish-saber-1782',
      Name: 'Polish Saber 1782',
      Description: 'Authentic recreation of an 18th century cavalry saber with handcrafted detailing.',
      ThumbnailUrl: 'images/kowal-transformed.png',
      Images: [
        'images/kowal-transformed.png',
        'images/kowal-transformed-2.png',
        'images/background-main.png',
      ],
    },
    {
      Id: 'dueling-blade-custom',
      Name: 'Dueling Blade Custom',
      Description: 'Balanced and elegant dueling blade tailored to the customer grip and handling style.',
      ThumbnailUrl: 'images/kowal-transformed-2.png',
      Images: [
        'images/kowal-transformed-2.png',
        'images/kowal-transformed.png',
        'images/background.png',
      ],
    },
    {
      Id: 'ornamental-guard-set',
      Name: 'Ornamental Guard Set',
      Description: 'Decorative guard composition with engraved motifs inspired by historical Polish craft.',
      ThumbnailUrl: 'images/background-main.png',
      Images: [
        'images/background-main.png',
        'images/background.png',
        'images/kowal-transformed.png',
      ],
    },
    {
      Id: 'blacksmith-workbench',
      Name: 'Blacksmith Workbench',
      Description: 'Workshop scene presenting forging process, finishing, and custom assembly details.',
      ThumbnailUrl: 'images/background.png',
      Images: [
        'images/background.png',
        'images/background-main.png',
        'images/kowal-transformed-2.png',
      ],
    },
    {
      Id: 'signature-collection',
      Name: 'Signature Collection',
      Description: 'Selected pieces from the signature collection, each finished and inspected by hand.',
      ThumbnailUrl: 'images/logo-t.png',
      Images: [
        'images/logo-t.png',
        'images/kowal-transformed.png',
        'images/kowal-transformed-2.png',
      ],
    },
  ],
};
