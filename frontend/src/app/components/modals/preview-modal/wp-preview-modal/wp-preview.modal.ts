// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
// ++

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from "@angular/core";
import {OpModalComponent} from "core-components/op-modals/op-modal.component";
import {OpModalLocalsToken, OpModalService} from "core-components/op-modals/op-modal.service";
import {OpModalLocalsMap} from "core-components/op-modals/op-modal.types";
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {WorkPackageResource} from "core-app/modules/hal/resources/work-package-resource";
import {WorkPackageDmService} from "core-app/modules/hal/dm-services/work-package-dm.service";
import {HalResource} from "core-app/modules/hal/resources/hal-resource";
import {Highlighting} from "core-components/wp-fast-table/builders/highlighting/highlighting.functions";

@Component({
  templateUrl: './wp-preview.modal.html',
  styleUrls: ['./wp-preview.modal.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WpPreviewModal extends OpModalComponent implements OnInit {
  public workPackage:WorkPackageResource;

  public text = {
    created_by: this.i18n.t('js.label_created_by'),
  };

  constructor(readonly elementRef:ElementRef,
              @Inject(OpModalLocalsToken) readonly locals:OpModalLocalsMap,
              readonly cdRef:ChangeDetectorRef,
              readonly i18n:I18nService,
              readonly workPackageDmService:WorkPackageDmService,
              readonly opModalService:OpModalService) {
    super(locals, cdRef, elementRef);
  }


  ngOnInit() {
    super.ngOnInit();
    const workPackageLink = this.locals.workPackageLink;
    const workPackageId = HalResource.idFromLink(workPackageLink);

    this.workPackageDmService.loadWorkPackageById(workPackageId)
      .then((workPackage:WorkPackageResource) => {
        this.workPackage = workPackage;
        this.cdRef.detectChanges();
      });
  }

  highlightingColor(resource:HalResource, background:boolean = false) {
    if (background) {
      return Highlighting.backgroundClass(resource.$halType.toLowerCase(), resource.id!);
    } else {
      return Highlighting.inlineClass(resource.$halType.toLowerCase(), resource.id!);
    }
  }
}
