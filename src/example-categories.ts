export const exampleCategories = [
    {
      id: 'cat1',
      name: 'Business',
      children: [
        {
          id: 'cat1-1',
          name: 'Finance',
          children: [
            { id: 'cat1-1-1', name: 'Banking' },
            { id: 'cat1-1-2', name: 'Investment' },
            { id: 'cat1-1-3', name: 'Insurance' }
          ]
        },
        {
          id: 'cat1-2',
          name: 'Marketing',
          children: [
            { id: 'cat1-2-1', name: 'Digital' },
            { id: 'cat1-2-2', name: 'Traditional' }
          ]
        },
        {
          id: 'cat1-3',
          name: 'Operations',
          children: []
        }
      ]
    },
    {
      id: 'cat2',
      name: 'Personal',
      children: [
        {
          id: 'cat2-1',
          name: 'Family',
          children: [
            { id: 'cat2-1-1', name: 'Immediate' },
            { id: 'cat2-1-2', name: 'Extended' }
          ]
        },
        {
          id: 'cat2-2',
          name: 'Friends',
          children: []
        }
      ]
    },
    {
      id: 'cat3',
      name: 'Other',
      children: []
    }
  ];