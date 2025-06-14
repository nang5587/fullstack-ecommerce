const categoryTree = {
    top: {
        sleeveless: ['top', 't_shirts', 'outer'],
        long: ['t_shirts', 'outer', 'sweatshirts', 'shirts', 'zip_ups', 'knitwear'],
        shorts: ['t_shirts', 'shirts']
    },
    bottom: {
        long: ['leggings', 'jogger', 'socks', 'cotton', 'training', 'cargo', 'jeans', 'slacks'],
        shorts: ['training', 'jeans', 'leggings', 'cotton']
    },
    underwear: {
        top: ['bra', 'sleepwear'],
        bottom: ['panties', 'sleepwear']
    },
    acc: {
        items: ['socks', 'hairband', 'hairpin', 'umbrella', 'belt', 'shoes', 'gloves', 'hats', 'earring', 'bag', 'sunglasses'],
        jewelry: ['earring']
    },
    kids: {
        long: ['sweatshirts', 'jumpsuit', 'jeans', 't_shirts', 'cotton', 'outer', 'bottom'],
        sleeveless: ['jumpsuit', 'sleeveless'],
        shorts: ['jumpsuit', 'top']
    },
    swimwear: {
        bikini: ['top', 'bottom'],
        one_pice: ['one_pice'],
        items: ['hats']
    },
    skirts_dress: {
        skirts: ['mini_skirts'],
        one_pice: ['one_pice']
    }
};
export default categoryTree;