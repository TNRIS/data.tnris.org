client-api
    - endpoints
        - collection
            - getExtent
            - showExtent
            - hideExtent
            - getResources
            - getResourcesAreas
            - showResourcesAreas
            - hideResourcesAreas
        - catalog
            - getCollections(filterProps)
            - getCatalogPages
            - getCurrentPage
            - setCurrentPage
            - getIncrement
            - setIncrement(enum(12,24,48,96))
            - getSearch
            - setSearch
            - resetSearch
            - getFilters
            - setFilters({...filters})
        - cart
            - getCart
            - addCartItem(itemProps)
            - removeCartItem(itemProps)
            - removeAllCartItems
        - form
            - getForm
            - setFormValues
            - getFormValues
            - resetFormValues