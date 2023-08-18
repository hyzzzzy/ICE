import { TypeProjectList } from '../interfaces/Project.interface';
import React, { Dispatch, ReactNode, createContext, useContext, useReducer } from 'react';

type TypeProjectListData = {
  data: { pageSize: number; posts: TypeProjectList[]; moreData: boolean };
  isLoading: boolean;
  isError: boolean;
  error: { message: string };
};

type TypeProjectListPayload = { pageSize: number; posts: TypeProjectList[]; moreData: boolean };

type ProjectListDataAction =
  | { type: 'GET_POSTS'; payload: TypeProjectListPayload }
  | { type: 'GET_NEW_PAGE'; payload: TypeProjectListPayload }
  | { type: 'HOLD_MORE_DATA' };

interface ProjectListDataProviderProps {
  children: ReactNode;
}

const initialState: TypeProjectListData = {
  data: { pageSize: 0, posts: [], moreData: false },
  isLoading: true,
  isError: false,
  error: { message: '' },
};
const ProjectListDataStateContext = createContext<TypeProjectListData>(initialState);

type ProjectListDataDispatch = Dispatch<ProjectListDataAction>;
const ProjectListDataDispatchContext = createContext<ProjectListDataDispatch | undefined>(
  undefined
);

const projectListDataReducer = (
  projectListData: TypeProjectListData,
  action: ProjectListDataAction
): TypeProjectListData => {
  switch (action.type) {
    case 'GET_POSTS':
      return { ...projectListData, data: action.payload, isLoading: false };

    case 'GET_NEW_PAGE': {
      const { pageSize, posts, moreData } = action.payload;
      return {
        ...projectListData,
        data: {
          pageSize,
          posts: [...projectListData.data.posts, ...posts],
          moreData,
        },
        isLoading: false,
      };
    }

    case 'HOLD_MORE_DATA': {
      return {
        ...projectListData,
        data: {
          ...projectListData.data,
          moreData: false,
        },
      };
    }

    default:
      return projectListData;
  }
};

export function ProjectListDataProvider({ children }: ProjectListDataProviderProps) {
  const [projectListDataState, dispatch] = useReducer(projectListDataReducer, initialState);

  return (
    <ProjectListDataDispatchContext.Provider value={dispatch}>
      <ProjectListDataStateContext.Provider value={projectListDataState}>
        {children}
      </ProjectListDataStateContext.Provider>
    </ProjectListDataDispatchContext.Provider>
  );
}

export function useProjectListState() {
  const state = useContext(ProjectListDataStateContext);
  if (!state) throw new Error('ProjectListStateProvider not found');
  return state;
}

export function useProjectListDispatch() {
  const dispatch = useContext(ProjectListDataDispatchContext);
  if (!dispatch) throw new Error('ProjectListDispatchProvider not found');
  return dispatch;
}
