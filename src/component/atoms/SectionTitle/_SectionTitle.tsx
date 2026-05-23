import React, { type FC, memo } from 'react';

interface ISectionTitleProps {
    content: string;
    styles?: string;
}

const _SectionTitle: FC<ISectionTitleProps> = (props) => {
    const { styles, content } = props;

    return <h1>{content}</h1>;
};

export default memo(_SectionTitle);
