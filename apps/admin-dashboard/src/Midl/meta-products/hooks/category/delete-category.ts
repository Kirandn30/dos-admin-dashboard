import { firestore } from 'apps/admin-dashboard/src/config/firebase.config';
import { runTransaction } from 'firebase/firestore';
import React from 'react';
import { useDispatch } from 'react-redux';
import { from } from 'rxjs';

import {
  setEditedMetaProductCategory,
  setMetaProductCategoryEditError,
} from '../../store/meta-product.category.slice';
import { metaProductCategoryRepo } from './helpers-category';

async function deleteCategoryAsyncWrapper(docId: string, userName: string) {
  const res = await runTransaction(firestore, async () => {
    const doc = await metaProductCategoryRepo.updateOne(
      { status: 'deleted' },
      docId
    );
    if ('severity' in doc) return doc;
    else {
      return await metaProductCategoryRepo.getOne(docId);
    }
  });
  return res;
}

export default function useDeleteCategory(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function deleteCategory(docId: string, userName: string) {
    setLoadingFlag(true);
    const obs$ = from(deleteCategoryAsyncWrapper(docId, userName));
    const sub = obs$.subscribe((res) => {
      if ('severity' in res) dispatch(setMetaProductCategoryEditError(res));
      else {
        dispatch(setEditedMetaProductCategory(res));
        dispatch(setMetaProductCategoryEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, deleteCategory };
}