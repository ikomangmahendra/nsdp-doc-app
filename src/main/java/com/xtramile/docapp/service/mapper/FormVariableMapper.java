package com.xtramile.docapp.service.mapper;

import com.xtramile.docapp.domain.FormVariable;
import com.xtramile.docapp.service.dto.FormVariableDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link FormVariable} and its DTO {@link FormVariableDTO}.
 */
@Mapper(componentModel = "spring")
public interface FormVariableMapper extends EntityMapper<FormVariableDTO, FormVariable> {}
